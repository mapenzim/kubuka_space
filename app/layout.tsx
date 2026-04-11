import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from 'geist/font/mono';
import { Theme } from "@radix-ui/themes";

import "./globals.css";
import { meta_config } from "./meta_config";
import { Toaster } from "sonner";
import Provider from "@/context/provider";
import { auth } from "@/auth";
import { ReactNode } from "react";
import prisma from "@/lib/prisma";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import ScrollToTopButton from "@/components/scroltotop";
import AppCookieConsent from "@/components/policies/cookie_conset";

export const metadata: Metadata = {
  title: meta_config.appTitle,
  description: meta_config.appDescription,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  const someUserId = session?.user?.id;

  const cart = await prisma.cart.findMany({
    where: { userId: someUserId },
    include: { cartItems: { include: { merchandise: true } } },
  });

  return (
    <html 
      lang="en" 
      suppressHydrationWarning={true} 
      className="scroll-smooth" 
      data-scroll-behavior="smooth" 
    >
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Provider session={session} initialCart={cart.map(item => ({
          id: item.id,
          merchandise: {
            title: item.cartItems[0]?.merchandise?.title,
            price: Number(item.cartItems[0]?.merchandise?.price),
          },
          quantity: item.cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0),
        }))}
        >
          <Theme accentColor="iris" grayColor="sage" radius="small">
            {children}
          </Theme>
          <Toaster position="bottom-right" richColors />
        </Provider>
        <ScrollToTopButton />
        <AppCookieConsent />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
