import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from 'geist/font/mono';

import "./globals.css";
import { meta_config } from "./meta_config";
import { PropsType } from "@/lib/utils";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: meta_config.appTitle,
  description: meta_config.appDescription,
};

export default function RootLayout({ children }: PropsType) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="scroll-smooth" >
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
