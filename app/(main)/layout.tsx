import Footer from "@/components/ui/foot";
import { NavigationBar } from "@/components/ui/head";
import { ReactNode } from "react";

export default async function MainLayout({ children }: { children: ReactNode }){
  return (
    <main className="w-full items-center justify-center">
      <NavigationBar />
      { children }
      <Footer />
    </main>
  );
}
