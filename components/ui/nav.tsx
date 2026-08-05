"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";
import { SignoutButton } from "./sign_out";
import CartStatus from "../cart/components/cart_status";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isAdminRole } from "@/lib/roles";
import SupportNotificationLink from "@/components/chat/SupportNotificationLink";

const NavigationApp = () => {
  const navLinks = [
    { name: "Products", path: "/store" },
    { name: "Blog", path: "/posts" },
    { name: "Contact Us", path: "/contact_us" },
  ];
  const mobileNavLinks = [
    { name: "Products", path: "/store" },
    { name: "Blog", path: "/posts" },
  ];

  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const desktopLinkText = isScrolled
    ? "text-zinc-800 dark:text-zinc-100"
    : "text-white";

  const closeMenu = React.useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleSignout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("tempCart");
    localStorage.removeItem("tempCartId");
    router.refresh();
  }

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  React.useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex min-h-16 w-full items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 transition-all duration-500
      ${isScrolled 
        ? "bg-white/90 text-gray-700 shadow-md backdrop-blur-lg dark:bg-gray-900/95 dark:text-gray-300 py-2" 
        : "bg-indigo-500 text-white dark:bg-gray-900/95 dark:text-zinc-100 py-3"}`
      }
    >
      {/* Logo */}
      <a 
        href="/" 
        aria-label="Prebuilt UI"
        className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/90 p-1 md:h-12 md:w-12"
      >
        <Image
          src="/images/Kubuka_Logo.png"   // place your logo file in /public/logo.png
          alt="Kubuka Hub Logo"
          width={48}
          height={48}
          sizes="48px"
          className="h-full w-full object-contain"
        />
      </a>

      {/* Desktop Nav with hover effect */}
      <div className="hidden md:flex items-center gap-8 ml-7">
        {navLinks.map((link, i) => (
            <Link key={i} href={link.path} className={`group relative h-6 overflow-hidden ${desktopLinkText}`}>
            <span className="block text-inherit transition-transform duration-300 group-hover:-translate-y-full">
              {link.name}
            </span>
            <span className="absolute left-0 top-full block text-inherit transition-transform duration-300 group-hover:-translate-y-full">
              {link.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Right side: Cart + Login */} 
      <div className="hidden items-center justify-center gap-6 md:flex">
        <CartStatus isScrolled={isScrolled} />
        {user && <SupportNotificationLink />}
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
                  <DropdownMenu.Item shortcut="⌘ S" onSelect={() => router.push("/contact_us")}>
                    Contact support
                  </DropdownMenu.Item>
                  {isAdminRole(user.role) && (
                    <DropdownMenu.Item shortcut="⌘ D" asChild>
                      <Link href="/admin" className="w-full" referrerPolicy="no-referrer" target="_blank">
                        Admin Dashboard
                      </Link>
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

                  <DropdownMenu.Separator /> 
                            
                  <DropdownMenu.Item onSelect={handleSignout}>
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
      <div className="flex items-center gap-2 md:hidden">
        <CartStatus isScrolled={isScrolled} />
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="kubuka-mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/10 text-current transition-colors hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {isMenuOpen ? (
            <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Side Menu */}
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={closeMenu}
        />
      )}

      <aside
        id="kubuka-mobile-menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-1rem))] flex-col overflow-y-auto border-r border-zinc-200 bg-white px-5 pb-8 pt-5 text-zinc-900 shadow-2xl transition-transform duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
            <Image
              src="/images/Kubuka_Logo.png"
              alt=""
              width={40}
              height={40}
              sizes="40px"
              className="size-10 rounded-full object-contain"
            />
            <span className="text-sm font-semibold tracking-wide">Kubuka Space</span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="inline-flex size-10 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
          {[...mobileNavLinks, { name: "Contact Us", path: "/contact_us" }].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={closeMenu}
              className={`rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-zinc-100 hover:text-indigo-700 dark:hover:bg-zinc-800 dark:hover:text-indigo-300 ${pathname === link.path ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          {user ? (
            <div className="flex flex-col gap-2">
              <Link href="/profile" onClick={closeMenu} className="rounded-lg px-3 py-3 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Profile
              </Link>
              <SupportNotificationLink label="Contact support" />
              <SignoutButton close={closeMenu} />
            </div>
          ) : (
            <Link
              href="/authentication"
              className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
              onClick={closeMenu}
            >
              Sign in
            </Link>
          )}
        </div>
      </aside>
    </nav>
  );
};

export default NavigationApp;
