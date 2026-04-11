import Footer from "@/components/ui/foot";
import NavigationApp from "@/components/ui/nav";
import { ReactNode } from "react";

export default async function MainLayout({ children }: { children: ReactNode }){
  return (
    <>
      <NavigationApp />
      <main className="w-full items-center justify-center">
        { children }
      </main>
      <Footer />
    </>
  );
}
