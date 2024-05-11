import { PublicKey } from "@solana/web3.js";

export interface UserToken {
  mintAddress: PublicKey;
  userAccountAddress: PublicKey;
}
