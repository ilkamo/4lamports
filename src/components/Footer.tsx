import { metadata } from "@/app/layout";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-gray-50 border-t border-gray-100 shadow md:flex md:items-center md:justify-between md:p-4">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2024 {metadata.title?.toString()}. All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          Open source on{" "}
          <a
            href="https://github.com/ilkamo/4lamports"
            className="hover:underline me-4 md:me-6"
          >
            GitHub
          </a>
        </li>
      </ul>
    </footer>
  );
};
