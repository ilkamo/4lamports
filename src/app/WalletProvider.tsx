"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
require("@solana/wallet-adapter-react-ui/styles.css");

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { getRandomRpcUrl } from "@/shared/config/global";

// next/types pulls in react/experimental which augments ReactNode with
// Promise<ReactNode> for async server components. The wallet adapter types
// were not compiled with that augmentation, so TypeScript rejects them as
// JSX components on a clean build. Cast to FC<any> to bypass the mismatch.
const ConnectionProviderAny = ConnectionProvider as FC<any>;
const WalletProviderAny = WalletProvider as FC<any>;
const WalletModalProviderAny = WalletModalProvider as FC<any>;

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProviderAny endpoint={getRandomRpcUrl()}>
      <WalletProviderAny wallets={wallets}>
        <WalletModalProviderAny>{children}</WalletModalProviderAny>
      </WalletProviderAny>
    </ConnectionProviderAny>
  );
};

export default WalletContextProvider;
