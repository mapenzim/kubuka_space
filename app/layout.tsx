import type { Metadata } from "next";
import "./globals.css";
import { ContextProvider } from "~/context/provider";
import { NavigationBar } from "~/components/ui/head";
import Footer from "~/components/ui/footer";
import { meta_config } from "./meta_config";
import { auth } from "./api/auth/[...nextauth]/route";

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/

export const metadata: Metadata = {
  title: meta_config.appTitle,
  description: meta_config.appDescription,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`antialiased`}
      >
        <ContextProvider>
          <NavigationBar user={session?.user} />
          {children}
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}
