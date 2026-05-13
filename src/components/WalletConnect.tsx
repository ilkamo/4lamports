"use client";

import { FC, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export const WalletConnect: FC = () => {
  const { publicKey, disconnect, connecting, connected, wallet, connect } =
    useWallet();
  const { visible, setVisible } = useWalletModal();

  // When the modal closes with a wallet selected, trigger connect.
  // WalletMultiButton does this internally; we replicate it here.
  useEffect(() => {
    if (!visible && wallet && !connected && !connecting) {
      connect().catch(() => {});
    }
  }, [visible]);

  if (connecting) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/40 cursor-wait"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse" />
        Connecting…
      </button>
    );
  }

  if (publicKey) {
    const addr = publicKey.toBase58();
    const short = `${addr.slice(0, 4)}…${addr.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        <span className="hidden sm:block text-[11px] text-white/35 font-mono">
          {short}
        </span>
        <button
          onClick={disconnect}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 hover:border-red-500/30 hover:bg-red-500/[0.08] hover:text-red-400 transition-all duration-150"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 hover:border-[#9945FF]/35 hover:bg-[#9945FF]/[0.08] hover:text-white/90 transition-all duration-150"
    >
      <svg
        className="h-3.5 w-3.5 opacity-70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
        <path d="M16 12a2 2 0 0 0 0 4h5v-4h-5z" />
      </svg>
      Connect
    </button>
  );
};
