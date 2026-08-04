"use client";

import {
  AppWindowMacIcon,
  LayoutPanelTopIcon,
  MailPlus,
  Menu,
  Moon,
  NotebookTabs,
  ShoppingCart,
  Sun,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";

interface AdminShellProps {
  children: React.ReactNode;
}

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutPanelTopIcon },
  { href: "/admin/posts", label: "All Posts", icon: NotebookTabs },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/store", label: "Storefront", icon: ShoppingCart },
  { href: "/admin/messages", label: "Messages", icon: MailPlus },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/posts": "All Posts",
  "/admin/users": "User Management",
  "/admin/store": "Storefront & Orders",
  "/admin/messages": "Messages",
};

function isActivePath(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] ?? "Admin Dashboard";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("kubuka-admin-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(storedTheme ? storedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const hadDarkClass = root.classList.contains("dark");
    root.classList.remove("dark");

    return () => {
      root.classList.toggle("dark", hadDarkClass);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("kubuka-admin-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("admin-menu-open", mobileMenuOpen);
    return () => document.body.classList.remove("admin-menu-open");
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`admin-app h-dvh max-h-dvh overflow-hidden ${darkMode ? "admin-dark" : "admin-light"}`}>
      <Flex className="h-dvh max-h-dvh min-h-0 w-full overflow-hidden bg-(--gray-a2) text-(--gray-12)">
        <aside className="hidden h-dvh max-h-dvh w-64 shrink-0 flex-col border-r border-(--gray-a6) bg-(--admin-sidebar) md:flex">
          <AdminBrand />
          <Separator size="4" />
          <AdminContextHeader pageTitle={pageTitle} darkMode={darkMode} onToggleTheme={() => setDarkMode((current) => !current)} />
          <Separator size="4" />
          <AdminNavigation pathname={pathname} onNavigate={closeMobileMenu} />
        </aside>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={closeMobileMenu}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
        )}

        <aside
          id="admin-mobile-menu"
          aria-label="Admin navigation"
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(19rem,calc(100vw-1rem))] flex-col border-r border-(--gray-a6) bg-(--admin-sidebar) shadow-2xl transition-transform duration-200 md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4">
            <AdminBrand compact />
            <IconButton variant="ghost" aria-label="Close admin menu" onClick={closeMobileMenu}>
              <X size={20} />
            </IconButton>
          </div>
          <Separator size="4" />
          <AdminContextHeader pageTitle={pageTitle} darkMode={darkMode} onToggleTheme={() => setDarkMode((current) => !current)} />
          <Separator size="4" />
          <AdminNavigation pathname={pathname} onNavigate={closeMobileMenu} />
        </aside>

        <Flex direction="column" className="relative h-dvh max-h-dvh min-w-0 flex-1 overflow-hidden">
          <div className="admin-pattern pointer-events-none absolute inset-0 z-0" />

          <main className="relative z-10 min-h-0 flex-1 overflow-y-auto p-3 pt-16 sm:p-5 lg:p-6">
            {children}
          </main>

          <IconButton
            variant="soft"
            aria-label="Open admin menu"
            aria-controls="admin-mobile-menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
            className="fixed left-3 top-3 z-30 md:hidden"
          >
            <Menu size={20} />
          </IconButton>
        </Flex>
      </Flex>
    </div>
  );
}

function AdminBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Flex align="center" gap="2" className={compact ? "p-1" : "p-5"}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-indigo-500 text-white">
        <AppWindowMacIcon size={18} />
      </div>
      <Heading as="h2" size="5" weight="bold" className="text-(--admin-sidebar-foreground)">
        Kubuka Admin
      </Heading>
    </Flex>
  );
}

function AdminContextHeader({
  pageTitle,
  darkMode,
  onToggleTheme,
}: {
  pageTitle: string;
  darkMode: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <Heading as="h1" size="4" className="min-w-0 truncate text-(--admin-sidebar-foreground)">
        {pageTitle}
      </Heading>
      <Button
        type="button"
        variant="soft"
        color="gray"
        onClick={onToggleTheme}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className="shrink-0"
      >
        {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        <span className="hidden lg:inline">{darkMode ? "Light" : "Dark"}</span>
      </Button>
    </div>
  );
}

function AdminNavigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Admin sections">
      <Text size="1" weight="bold" mb="2" className="px-3 uppercase tracking-wider text-(--admin-sidebar-muted)">
        Overview
      </Text>
      {navigation.map(({ href, label, icon: Icon }) => (
        <AdminLink
          key={href}
          href={href}
          label={label}
          icon={Icon}
          active={isActivePath(pathname, href)}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function AdminLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof LayoutPanelTopIcon;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Button asChild variant="ghost" size="3" className="w-full justify-start">
      <Link
        href={href}
        onClick={onNavigate}
        className={`flex w-full items-center justify-start gap-3 rounded-md px-3 py-2.5 ${
          active
            ? "bg-(--admin-sidebar-active) text-(--admin-sidebar-active-foreground)"
            : "text-(--admin-sidebar-foreground) hover:bg-(--admin-sidebar-hover)"
        }`}
      >
        <Icon size={18} aria-hidden="true" />
        <Text size="3" weight="medium">
          {label}
        </Text>
      </Link>
    </Button>
  );
}
