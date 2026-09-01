import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-auto">
      <div className="mt-8 flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-900 via-sky-800 to-indigo-700 px-2 dark:from-zinc-800/75 dark:via-gray-800/75 dark:to-zinc-700/75 md:mt-0">
        {children}
      </div>
    </div>
  );
}
