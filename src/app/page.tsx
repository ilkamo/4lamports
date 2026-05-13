import WalletContextProvider from "./WalletProvider";
import { Collector } from "@/components/Collector";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070711]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#9945FF]/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 h-[300px] w-[400px] rounded-full bg-[#14F195]/05 blur-[100px]" />
      </div>

      <WalletContextProvider>
        <Navbar />

        <main className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-28">
          {/* Badge */}
          <div className="mb-5 flex items-center gap-2 rounded-full border border-[#9945FF]/25 bg-[#9945FF]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-xs font-medium text-[#14F195] tracking-widest uppercase">
              Verified by Blowfish · Solana
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-center leading-tight tracking-tight">
            Reclaim your{" "}
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
              SOL
            </span>
          </h1>
          <p className="mt-3 text-sm text-white/40 text-center max-w-sm leading-relaxed">
            Close empty token accounts and recover ~0.002 SOL in rent per
            account — instantly, no fees.
          </p>

          {/* Main card */}
          <Collector />

          {/* Info section */}
          <div className="mt-8 max-w-xl rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 backdrop-blur-sm">
            <p className="text-xs text-white/40 leading-relaxed">
              Solana charges ~0.002 SOL rent per token account to keep data
              on-chain. When a token balance reaches zero, that space — and your
              SOL — can be reclaimed.{" "}
              <span className="text-white/60 font-medium">4lamports</span> is
              fully open source and{" "}
              <span className="text-white/60 font-medium">
                verified by Blowfish
              </span>
              .{" "}
              <a
                href="https://www.bulbapp.io/p/508c77d4-dad1-4d3f-882d-de51f8579aa3/4lamports-find-hidden-sol-in-your-wallet"
                target="_blank"
                rel="noreferrer"
                className="text-[#9945FF] hover:text-[#14F195] transition-colors underline underline-offset-4 decoration-[#9945FF]/30"
              >
                Learn more →
              </a>
            </p>
          </div>
        </main>

        <Footer />
      </WalletContextProvider>
    </div>
  );
}
