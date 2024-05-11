"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useEffect, useState } from "react";
import { UserToken } from "@/shared/interfaces/interfaces";
import { RentCollector } from "@/shared/services/rentCollector";
import toast from "react-hot-toast";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  SvgIcon,
} from "@mui/material";
import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { GradientCircularProgress } from "./GradientCircularProgress";

export const Collector: FC = () => {
  const { connection } = useConnection();
  const rentCollector = new RentCollector(connection);
  const { publicKey, sendTransaction, connected } = useWallet();
  const [accountsToFree, setAccountsToFree] = useState<UserToken[]>([]);
  const [checkedState, setCheckedState] = useState<boolean[]>([]);
  const [waitForTransaction, setWaitForTransaction] = useState<boolean>(false);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const [txSignature, setTxSignature] = useState<string>("");

  const handleOnChange = (position: number) => {
    // Set the max number of instructions per transaction at 10.
    if (checkedState.filter((c) => c).length >= 10 && !checkedState[position]) {
      showError("Max 10 accounts can be claimed at once");
      return;
    }

    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  useEffect(() => {
    if (!connected || !publicKey) {
      return;
    }

    setLoadingAccounts(true);
    rentCollector
      .getUserTokenAccountsWithZeroBalance(publicKey)
      .then((accounts) => {
        setAccountsToFree(accounts);
        setLoadingAccounts(false);
      })
      .catch((error) => {
        showError("Error fetching accounts. Refresh and try again.");
        console.error(error);
      });
  }, [connection, publicKey, connected]);

  // Initialize checkedState with false values.
  useEffect(() => {
    if (accountsToFree.length > 0) {
      setCheckedState(new Array(accountsToFree.length).fill(false));
    }
  }, [accountsToFree]);

  const freeAccounts = async () => {
    if (!connection || !publicKey) {
      return;
    }

    try {
      const toFree = accountsToFree
        .filter((_, i) => checkedState[i])
        .map((account) => account.userAccountAddress);

      const transaction = await rentCollector.closeTokenAccountsTransaction(
        publicKey,
        toFree
      );

      const tx = await sendTransaction(transaction, connection);
      setTxSignature(tx);
      setWaitForTransaction(true);

      let timeout: NodeJS.Timeout;
      const subId = connection.onSignature(
        tx,
        (result) => {
          if (result.err) {
            showError("Error claming SOL. Try again.");
            console.error(result.err);
          } else {
            showSuccess("SOL claimed successfully");
            // substract claimed accounts from the list
            setAccountsToFree(
              accountsToFree.filter((_, i) => !checkedState[i])
            );
            clearTimeout(timeout);
          }
          setWaitForTransaction(false);
        },
        "finalized"
      );

      timeout = setTimeout(() => {
        connection.removeSignatureListener(subId);
        showError("Transaction timed out. Try again.");
        setTxSignature("");
        setWaitForTransaction(false);
      }, 90000);
    } catch (error) {
      showError("Error freeing accounts. Try again.");
      setWaitForTransaction(false);
      console.error(error);
    }
  };

  const amountToClaim = (): string => {
    return (checkedState.filter((c) => c).length * 0.002).toFixed(3);
  };

  return (
    <div className="container max-w-xl mt-4 p-8 rounded-md border">
      {connected ? (
        <div>
          {accountsToFree.length === 0 && publicKey && (
            <p className="text-slate-800 text-lg font-medium p-2 flex flex-col items-center">
              {loadingAccounts ? (
                <>
                  <span className="mb-2">Loading accounts...</span>
                  <CircularProgress size={24} />
                </>
              ) : (
                "No 0 balance token accounts found in your wallet."
              )}
            </p>
          )}
          {accountsToFree.length > 0 && publicKey && (
            <div className="flex flex-col items-center">
              <p className="text-slate-800 text-lg font-medium p-2">
                Found tokens with zero balance in your wallet
              </p>
              <p className="text-slate-900 text-sm mb-8">
                Check tokens to start claiming SOL (unckeck to skip):
              </p>
              <FormGroup className="mb-8">
                {accountsToFree.map((account, i) => (
                  <FormControlLabel
                    key={`label-key-${i}`}
                    className="text-xs text-gray-500 border-b border-gray-100"
                    control={
                      <Checkbox
                        key={`input-key-${i}`}
                        checked={checkedState[i] || false}
                        onChange={() => handleOnChange(i)}
                      />
                    }
                    label={
                      <a
                        className="text-slate-800 hover:text-slate-600 text-xs hover:underline"
                        href={`https://solscan.io/token/${account.mintAddress.toBase58()}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {account.mintAddress.toBase58()}
                      </a>
                    }
                  />
                ))}
              </FormGroup>
              <LoadingButton
                loading={waitForTransaction}
                disabled={
                  checkedState.filter((c) => c).length === 0 ||
                  waitForTransaction
                }
                loadingIndicator={
                  <SvgIcon component={GradientCircularProgress} />
                }
                color="primary"
                variant="outlined"
                onClick={freeAccounts}
              >
                Claim back ~{amountToClaim()} SOL
              </LoadingButton>
              {txSignature && (
                <>
                  <p className="text-slate-400 text-xs mt-8 p-2">
                    Check for transaction details:{" "}
                  </p>
                  <a
                    className="text-sky-500 hover:text-sky-400 text-[10px]"
                    href={`https://solscan.io/tx/${txSignature}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {txSignature}
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-800 text-lg font-medium p-2 flex flex-col items-center">
          Connect your wallet to check the amount of SOL you can claim back.
        </p>
      )}
    </div>
  );
};
