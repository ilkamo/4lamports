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
          <h3 className="text-2xl font-medium text-slate-800 mb-0 mt-20">
            Get <span className="text-orange-500 font-semibold">SOL</span> from
            burning unused tokens
          </h3>
          <h4 className="text-2xl font-light text-slate-600 mb-8 mt-2">
            Redeem paid rental fees.
          </h4>
          <Image
            src={myLamports}
            className="w-full max-w-80 rounded-md shadow-lg mb-8"
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
          <p className="text-xs text-gray-600 mb-8 mt-8 max-w-xl">
            With many scam services out there, we've taken extra steps to secure
            your trust by obtaining{" "}
            <span className="font-semibold">verification from Blowfish</span>.
            Rest assured, 4lamports is a safe and reliable choice. For more
            details on how this works check the{" "}
            <a
              href="https://www.bulbapp.io/p/508c77d4-dad1-4d3f-882d-de51f8579aa3/4lamports-find-hidden-sol-in-your-wallet"
              target="_blank"
              className="underline underline-offset-4 decoration-orange-400 hover:decoration-orange-500 hover:text-orange-500"
            >
              official post from the developers
            </a>
            .
          </p>
        </main>
        <Footer />
      </WalletContextProvider>
    </div>
  );
}
