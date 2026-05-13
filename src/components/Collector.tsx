"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useEffect, useState } from "react";
import { UserToken } from "@/shared/interfaces/interfaces";
import { RentCollector } from "@/shared/services/rentCollector";
import toast from "react-hot-toast";

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
    // Max 10 instructions per transaction.
    if (checkedState.filter((c) => c).length >= 10 && !checkedState[position]) {
      toast.error("Max 10 accounts can be claimed at once");
      return;
    }
    setCheckedState(
      checkedState.map((item, index) => (index === position ? !item : item))
    );
  };

  useEffect(() => {
    if (!connected || !publicKey) return;

    setLoadingAccounts(true);
    rentCollector
      .getUserTokenAccountsWithZeroBalance(publicKey)
      .then((accounts) => {
        setAccountsToFree(accounts);
        setLoadingAccounts(false);
      })
      .catch((error) => {
        toast.error("Error fetching accounts. Refresh and try again.");
        console.error(error);
      });
  }, [connection, publicKey, connected]);

  useEffect(() => {
    if (accountsToFree.length > 0) {
      setCheckedState(new Array(accountsToFree.length).fill(false));
    }
  }, [accountsToFree]);

  const freeAccounts = async () => {
    if (!connection || !publicKey) return;

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
            toast.error("Error claiming SOL. Try again.");
            console.error(result.err);
          } else {
            toast.success("SOL claimed successfully");
            setAccountsToFree(accountsToFree.filter((_, i) => !checkedState[i]));
            clearTimeout(timeout);
          }
          setWaitForTransaction(false);
        },
        "finalized"
      );

      timeout = setTimeout(() => {
        connection.removeSignatureListener(subId);
        toast.error("Transaction timed out. Try again.");
        setTxSignature("");
        setWaitForTransaction(false);
      }, 90000);
    } catch (error) {
      toast.error("Error freeing accounts. Try again.");
      setWaitForTransaction(false);
      console.error(error);
    }
  };

  const amountToClaim = (): string =>
    (checkedState.filter((c) => c).length * 0.002).toFixed(3);

  const selectedCount = checkedState.filter((c) => c).length;

  return (
    <div className="w-full max-w-xl mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-6 shadow-[0_0_60px_rgba(153,69,255,0.07)]">
      {connected ? (
        <>
          {accountsToFree.length === 0 && publicKey && (
            <div className="flex flex-col items-center py-10 gap-3">
              {loadingAccounts ? (
                <>
                  <div className="h-8 w-8 rounded-full border-2 border-[#9945FF]/20 border-t-[#9945FF] animate-spin" />
                  <p className="text-white/40 text-sm">Scanning your wallet…</p>
                </>
              ) : (
                <p className="text-white/50 text-sm text-center">
                  No empty token accounts found in your wallet.
                </p>
              )}
            </div>
          )}

          {accountsToFree.length > 0 && publicKey && (
            <div className="flex flex-col">
              <div className="mb-4">
                <p className="text-white font-semibold text-base">
                  {accountsToFree.length} empty{" "}
                  {accountsToFree.length === 1 ? "account" : "accounts"} found
                </p>
                <p className="text-white/35 text-xs mt-0.5">
                  Select up to 10 accounts to close per transaction.
                </p>
              </div>

              <div className="space-y-1.5 mb-5 max-h-60 overflow-y-auto pr-1">
                {accountsToFree.map((account, i) => (
                  <label
                    key={`label-key-${i}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                      checkedState[i]
                        ? "bg-[#9945FF]/10 border border-[#9945FF]/25"
                        : "bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.04]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checkedState[i] || false}
                      onChange={() => handleOnChange(i)}
                    />
                    <div
                      className={`flex-shrink-0 h-4 w-4 rounded border transition-all flex items-center justify-center ${
                        checkedState[i]
                          ? "bg-gradient-to-br from-[#9945FF] to-[#14F195] border-transparent"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {checkedState[i] && (
                        <svg
                          className="h-2.5 w-2.5 text-white"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <a
                      className="text-white/50 hover:text-white/80 text-xs font-mono truncate transition-colors"
                      href={`https://solscan.io/token/${account.mintAddress.toBase58()}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {account.mintAddress.toBase58()}
                    </a>
                  </label>
                ))}
              </div>

              <button
                disabled={selectedCount === 0 || waitForTransaction}
                onClick={freeAccounts}
                className={`w-full rounded-xl py-3 px-6 text-sm font-semibold transition-all duration-200 ${
                  selectedCount === 0 || waitForTransaction
                    ? "bg-white/[0.04] text-white/25 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:opacity-90 shadow-[0_0_24px_rgba(153,69,255,0.35)] hover:shadow-[0_0_36px_rgba(153,69,255,0.5)]"
                }`}
              >
                {waitForTransaction ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Confirming on-chain…
                  </span>
                ) : (
                  `Claim ~${amountToClaim()} SOL`
                )}
              </button>

              {txSignature && (
                <div className="mt-4 rounded-xl bg-white/[0.015] border border-white/[0.05] p-3">
                  <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1">
                    Transaction
                  </p>
                  <a
                    className="text-[#14F195]/70 hover:text-[#14F195] text-[10px] font-mono break-all transition-colors"
                    href={`https://solscan.io/tx/${txSignature}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {txSignature}
                  </a>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center py-10 gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#9945FF]/15 to-[#14F195]/15 border border-[#9945FF]/20 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-[#9945FF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
          </div>
          <p className="text-white/40 text-sm text-center">
            Connect your wallet to scan for recoverable SOL.
          </p>
        </div>
      )}
    </div>
  );
};
