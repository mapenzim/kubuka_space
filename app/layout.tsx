import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";

import "./globals.css";
import { meta_config } from "./meta_config";
import { Toaster } from "sonner";
import Provider from "@/context/provider";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import ScrollToTopButton from "@/components/scroltotop";

export const metadata: Metadata = {
  title: meta_config.appTitle,
  description: meta_config.appDescription,
};

const themeInitScript = `
  (() => {
    try {
      const stored = localStorage.getItem("kubuka-admin-theme");
      const dark = stored === "dark";
      document.documentElement.classList.toggle("dark", dark);
    } catch {}
  })();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning={true} 
      className="scroll-smooth" 
      data-scroll-behavior="smooth" 
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased dark:bg-gray-950!"
      >
        <Provider>
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
