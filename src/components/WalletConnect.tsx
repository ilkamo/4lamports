"use client";

import { FC } from "react";

import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const WalletConnect: FC = () => {
  return <WalletMultiButtonDynamic />;
};
