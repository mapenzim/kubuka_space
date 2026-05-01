import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <div className="w-full overflow-auto">
            
    <div className="flex min-h-screen items-center justify-center px-2 md:mt-0 mt-8 bg-linear-to-br dark:from-zinc-800/75 dark:via-gray-800/75 dark:to-zinc-700/75 from-indigo-900 via-sky-800 to-indigo-700">
            {children}
    </div>
    </div>
  );
}
