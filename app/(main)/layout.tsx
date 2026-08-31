import Footer from "@/components/ui/foot";
import NavigationApp from "@/components/ui/nav";
import { CartProvider } from "@/context/cartContext";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }){
  return (
    <CartProvider>
      <div className="public-app min-h-screen">
        <NavigationApp />
        <main className="w-full items-center justify-center pt-16 md:pt-0">
          { children }
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
