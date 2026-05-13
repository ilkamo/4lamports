import Image from "next/image";
import coinIcon from "../../public/coin-receive-svgrepo-com.svg";

import { FC } from "react";
import { WalletConnect } from "./WalletConnect";
import { metadata } from "../app/layout";

export const Navbar: FC = () => {
  return (
    <nav className="fixed w-full z-20 top-0 start-0 backdrop-blur-md bg-[#070711]/80 border-b border-white/[0.06]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-6 py-4">
        <a
          href="https://4lamports.vercel.app/"
          className="flex items-center space-x-2.5"
        >
          <Image
            src={coinIcon}
            className="h-7 w-7 brightness-0 invert opacity-80"
            alt="4lamports"
          />
          <span className="self-center text-lg font-bold whitespace-nowrap bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
            {metadata.title?.toString()}
          </span>
        </a>
        <div className="flex md:order-2">
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
};
