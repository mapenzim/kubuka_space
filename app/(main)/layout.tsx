import { ReactNode } from "react";

export default async function Layout({
  children
}: Readonly<{ children: ReactNode }>){
  return (
    <div className="flex w-full min-h-screen items-start justify-center mt-8 md:mt-16">
      { children }
    </div>
  );
}
