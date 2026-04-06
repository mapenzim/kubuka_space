import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./cartContext";

interface CartItem {
  id: string;
  merchandise: { title: string; price: number };
  quantity: number;
}

export default function Provider(
  { children, session, initialCart }: { children: React.ReactNode; session: any; initialCart: CartItem[] }
) {
  return (
    <SessionProvider session={session}>
      <CartProvider initialCart={initialCart}>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
