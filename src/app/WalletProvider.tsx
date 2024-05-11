"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
require("@solana/wallet-adapter-react-ui/styles.css");

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { getRandomRpcUrl } from "@/shared/config/global";

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={getRandomRpcUrl()}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
