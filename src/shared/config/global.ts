import { PublicKey } from "@solana/web3.js";

export const FEE_DESTINATION = new PublicKey(
  process.env.NEXT_PUBLIC_FEE_ADDRESS || ""
);
export const FEE_LAMPORTS: number = 100000; // 0.0001 SOL

export const getRandomRpcUrl = () => {
  const urls = process.env.NEXT_PUBLIC_RPC_ENDPOINT?.split(",") || [
    "https://api.devnet.solana.com",
  ];

  return urls[Math.floor(Math.random() * urls.length)];
};
