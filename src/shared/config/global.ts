import { PublicKey } from "@solana/web3.js";

const FEE_ADDRESS = process.env.NEXT_PUBLIC_FEE_ADDRESS;
export const FEE_DESTINATION = FEE_ADDRESS
  ? new PublicKey(FEE_ADDRESS)
  : PublicKey.default;
export const FEE_LAMPORTS: number = 100000; // 0.0001 SOL

export const getRandomRpcUrl = () => {
  const urls = process.env.NEXT_PUBLIC_RPC_ENDPOINT?.split(",") || [
    "https://api.devnet.solana.com",
  ];

  return urls[Math.floor(Math.random() * urls.length)];
};
