import WalletContextProvider from "./WalletProvider";
import { Collector } from "@/components/Collector";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import Image from "next/image";
import myLamports from "../../public/mylamports.jpg";

export default function Home() {
  return (
    <div>
      <WalletContextProvider>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center pl-12 pr-12 pt-12 pb-24">
          <h3 className="text-3xl font-medium text-slate-800 mb-0 mt-20">
            Find hidden{" "}
            <span className="text-orange-500 font-semibold">SOL</span> in your
            own wallet
          </h3>
          <h4 className="text-2xl font-light text-slate-600 mb-8 mt-2">
            Redeem paid rental fees{" "}
            <span className="underline underline-offset-4 decoration-orange-400">
              for 0 balance token accounts
            </span>
            .
          </h4>
          <Image
            src={myLamports}
            className="w-full max-w-96 rounded-md shadow-lg mb-8"
            alt="My Lamports"
          />
          <p className="text-md text-gray-600 mb-8 max-w-xl">
            Token balances and NFTs are stored on the Solana blockchain in
            accounts. Keeping this data on-chain takes up space, so Solana
            charges a rent fee of ~0.002 SOL on accounts. This space can be
            reclaimed when the token balance reaches zero or when the NFT is
            transferred to a different wallet.
          </p>
          <Collector />
          <Footer />
        </main>
      </WalletContextProvider>
    </div>
  );
}
