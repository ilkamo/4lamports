import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { UserToken } from "../interfaces/interfaces";
import {
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
} from "@solana/spl-token";
import { FEE_DESTINATION, FEE_LAMPORTS } from "../config/global";

export class RentCollector {
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getUserTokenAccountsWithZeroBalance(
    userPublicKey: PublicKey
  ): Promise<UserToken[]> {
    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165, //size of account (bytes)
      },
      {
        memcmp: {
          offset: 32, //location of our query in the account (bytes)
          bytes: userPublicKey.toBase58(), //our search criteria, a base58 encoded string
        },
      },
    ];

    const accounts = await this.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: filters,
      }
    );

    let accountToClose: UserToken[] = [];

    accounts.forEach((account) => {
      const parsedAccountInfo: any = account.account.data;
      const tokenBalance: number =
        parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

      if (tokenBalance === 0) {
        const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];

        const mint: UserToken = {
          mintAddress: new PublicKey(mintAddress),
          userAccountAddress: account.pubkey,
        };

        accountToClose.push(mint);
      }
    });

    return accountToClose;
  }

  async closeTokenAccountsTransaction(
    userPublicKey: PublicKey,
    tokenAccounts: PublicKey[]
  ): Promise<VersionedTransaction> {
    let instructions: TransactionInstruction[] = [];

    tokenAccounts.forEach(async (account, i) => {
      instructions.push(
        createCloseAccountInstruction(
          account,
          userPublicKey,
          userPublicKey,
          [],
          TOKEN_PROGRAM_ID
        )
      );
    });

    instructions.push(
      // Transfer a small fee to devs for their hard work.
      SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: FEE_DESTINATION,
        lamports: FEE_LAMPORTS,
      })
    );

    const latestBlockhash = await this.connection.getLatestBlockhash(
      "confirmed"
    );

    const messageV0 = new TransactionMessage({
      payerKey: userPublicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    return transaction;
  }
}
