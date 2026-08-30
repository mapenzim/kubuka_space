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
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import ScrollToTopButton from "@/components/scroltotop";

export const metadata: Metadata = {
  title: meta_config.appTitle,
  description: meta_config.appDescription,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <html 
      lang="en" 
      suppressHydrationWarning={true} 
      className="scroll-smooth" 
      data-scroll-behavior="smooth" 
    >
      <body
        suppressHydrationWarning
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased dark:bg-gray-950!`}
      >
        <Provider session={session}>
          <Theme accentColor="iris" grayColor="sage" radius="small">
            {children}
          </Theme>
          <Toaster position="bottom-right" richColors />
        </Provider>
        <ScrollToTopButton />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
