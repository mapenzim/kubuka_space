import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { meta_config } from "./meta_config";
import { PropsType } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: meta_config.appTitle,
  description: meta_config.appDescription,
};

export default function RootLayout({ children }: PropsType) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="scroll-smooth" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
