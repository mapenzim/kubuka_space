import { ReactNode } from "react";
import { superUser } from "~/actions/data-actions";

export default async function Layout ({ children }: Readonly<{children: ReactNode}>) {

  await superUser();

  return (
    <div className="flex w-full h-screen items-start justify-center">
      {children}
    </div>
  );
}
