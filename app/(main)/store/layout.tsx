import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <section className="w-full min-h-screen overflow-y-auto items-center justify-center px-3 md:px-12 md:pt-16 dark:bg-slate-800">
      {children}
    </section>
  );
}
