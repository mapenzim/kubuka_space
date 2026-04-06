import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <section className="w-full min-h-screen overflow-y-auto items-center justify-center pt-8">
      {children}
    </section>
  );
}
