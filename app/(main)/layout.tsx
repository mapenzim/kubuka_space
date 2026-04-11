import Footer from "@/components/ui/foot";
import { NavigationBar } from "@/components/ui/head";
import { ReactNode } from "react";

export default async function MainLayout({ children }: { children: ReactNode }){
  return (
    <>
      <NavigationBar />
      <main className="w-full items-center justify-center">
        { children }
      </main>
      <Footer />
    </>
  );
}
