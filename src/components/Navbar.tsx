import Image from "next/image";
import coinIcon from "../../public/coin-receive-svgrepo-com.svg";

import { FC } from "react";
import { WalletConnect } from "./WalletConnect";
import { metadata } from "../app/layout";

export const Navbar: FC = () => {
  return (
    <nav className="bg-orange-50 shadow-md fixed w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://4lamports.vercel.app/"
          className="flex items-center space-x-3 rtl:space-x-reverse text-sky-950 antialiased"
        >
          <Image src={coinIcon} className="h-8 w-8" alt="4lamports" />
          <span className="self-center text-2xl font-bold whitespace-nowrap">
            {metadata.title?.toString()}
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
};
