import { metadata } from "@/app/layout";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full border-t border-white/[0.06] bg-[#070711]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <span className="text-xs text-white/30">
        © 2026 {metadata.title?.toString()}. All Rights Reserved.
      </span>
      <a
        href="https://github.com/ilkamo/4lamports"
        target="_blank"
        rel="noreferrer"
        className="text-xs text-white/30 hover:text-white/60 transition-colors"
      >
        GitHub →
      </a>
    </footer>
  );
};
