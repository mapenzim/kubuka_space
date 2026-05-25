import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <section className="w-full min-h-screen overflow-y-auto items-center justify-center md:pt-16 md:px-12 dark:bg-slate-800">
      {children}
    </section>
  );
}
