"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";
import { SignoutButton } from "./sign_out";
import CartStatus from "../cart/components/cart_status";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NavigationApp = () => {
  const navLinks = [
    { name: "Products", path: "/store" },
    { name: "Blog", path: "/posts" },
    { name: "Pricing", path: "/pricing" },
    { name: "Docs", path: "/docs" },
    { name: "Contact Us", path: "/contact_us" },
  ];

  const { data: session } = useSession();
                                                                                              
  const user = session?.user;
  const router = useRouter();

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
      ${isScrolled 
        ? "bg-white/80 dark:bg-gray-900 dark:text-gray-300 shadow-md dark:shadow-orange-500/50 text-gray-700 backdrop-blur-lg py-1 md:py-2" 
        : "bg-indigo-500 dark:bg-gray-900 dark:text-zinc-400 py-2 md:py-4"}`
      }
    >
      {/* Logo */}
      <a 
        href="/" 
        aria-label="Prebuilt UI"
        className="dark:rounded-full dark:p-1 dark:border dark:bg-gray-400 w-8 h-8 md:h-12 md:w-12 dark:overflow-hidden dark:items-center"
      >
        <img
          src="/images/Kubuka_Logo.png"   // place your logo file in /public/logo.png
          alt="Kubuka Hub Logo"
          className="object-contain"
        />
      </a>

      {/* Desktop Nav with hover effect */}
      <div className="hidden md:flex items-center gap-8 ml-7">
        {navLinks.map((link, i) => (
          <Link key={i} href={link.path} className="relative overflow-hidden h-6 group">
            <span className="block group-hover:-translate-y-full transition-transform duration-300">
              {link.name}
            </span>
            <span className="block absolute top-full left-0 group-hover:-translate-y-full transition-transform duration-300">
              {link.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Right side: Cart + Login */}
      <div className="hidden md:flex justify-center items-center gap-6">
        <CartStatus isScrolled={isScrolled} />
        {user 
          ? (	
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="classic" size="3" color="teal">
                      {user.name?.split(" ")[0][0]}
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content size="1" side="bottom" align="end">
                  <DropdownMenu.Item shortcut="⌘ E" onSelect={() => router.push("/profile")}>
                    Profile
                  </DropdownMenu.Item>
                  {(user.role === "ADMIN" || user.role === "SUPERUSER") && (
                    <DropdownMenu.Item shortcut="⌘ D" asChild>
                      <Link href="/admin" className="w-full" referrerPolicy="no-referrer" target="_blank">
                        Admin Dashboard
                      </Link>
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

                  <DropdownMenu.Separator />
                            
                  <DropdownMenu.Item onSelect={() => signOut({ redirect: false }).then(() => router.refresh())}>
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )
          : (
              <Link
                href="/authentication"
                className={`px-8 py-2 rounded-full transition-all duration-500 ${
                  isScrolled 
                    ? "text-white bg-black dark:bg-gray-500 dark:text-zinc-200" 
                    : "bg-white text-black dark:bg-zinc-400 dark:text-gray-900"
                }`}
              >
                Sign in
              </Link>
            )
        }
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <button aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            className={`h-6 w-6 cursor-pointer ${isScrolled ? "white" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white md:hidden flex flex-col items-start gap-6 font-medium text-gray-800 p-6 transition-transform duration-500 ease-in-out 
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <button
          aria-label="Close menu"
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Nav links */}
        {navLinks.map((link, i) => (
          <Link
            key={i}
            href={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-indigo-600 transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {/* Actions */}
        <Link 
          href="#contact-us"
          className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>

        {user 
          ? (
              <SignoutButton close={() => setIsMenuOpen(false)} />
            ) : (
              <Link
                href="/authentication"
                className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )
        }

      </div>
    </nav>
  );
};

export default NavigationApp;
