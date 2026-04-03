import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from 'geist/font/mono';

import "./globals.css";
import { meta_config } from "./meta_config";
import { PropsType } from "@/lib/utils";
import { Toaster } from "sonner";
import Provider from "@/context/provider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: meta_config.appTitle,
  description: meta_config.appDescription,
};

export default async function RootLayout({ children }: PropsType) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning={true} className="scroll-smooth" data-scroll-behavior="smooth" >
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Provider session={session}>
          {children}
          <Toaster position="bottom-right" richColors />
        </Provider>
      </body>
    </html>
  );
}
