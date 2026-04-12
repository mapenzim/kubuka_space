import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="w-full min-h-screen overflow-y-auto items-center justify-center dark:bg-gray-900">
      {children}
    </section>
  );
}