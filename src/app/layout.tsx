import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "4lamports",
  description:
    "Get SOL from burning unused tokens. Redeem paid rental fee for 0 balance token accounts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#070711] text-white antialiased`}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#0f0f1a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
