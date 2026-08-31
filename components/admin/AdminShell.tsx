"use client";

import {
  AppWindowMacIcon,
  ChevronDown,
  LayoutPanelTopIcon,
  MailPlus,
  Menu,
  Moon,
  NotebookTabs,
  LogOut,
  ShoppingCart,
  Sun,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const overviewNavigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutPanelTopIcon },
];

const navigationGroups = [
  {
    label: "Content",
    items: [
      { href: "/admin/posts", label: "All Posts", icon: NotebookTabs },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/store", label: "Storefront", icon: ShoppingCart },
      { href: "/admin/messages", label: "Messages", icon: MailPlus },
    ],
  },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/posts": "All Posts",
  "/admin/users": "User Management",
  "/admin/store": "Storefront & Orders",
  "/admin/messages": "Messages",
  "/admin/profile": "Administrator Profile",
};

const ADMIN_THEME_EVENT = "kubuka-admin-theme-change";

function subscribeToTheme(listener: () => void) {
  window.addEventListener(ADMIN_THEME_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(ADMIN_THEME_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

function setAdminTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  window.localStorage.setItem("kubuka-admin-theme", dark ? "dark" : "light");
  window.dispatchEvent(new Event(ADMIN_THEME_EVENT));
}

function isActivePath(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] ?? "Admin Dashboard";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const darkMode = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const toggleTheme = useCallback(() => {
    setAdminTheme(!darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.body.classList.toggle("admin-menu-open", mobileMenuOpen);
    return () => document.body.classList.remove("admin-menu-open");
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`admin-app h-dvh max-h-dvh overflow-hidden ${darkMode ? "admin-dark" : "admin-light"}`}>
      <Flex className="h-dvh max-h-dvh min-h-0 w-full overflow-hidden bg-(--gray-a2) text-(--gray-12)">
        <aside className="hidden h-dvh max-h-dvh w-64 shrink-0 flex-col border-r border-(--gray-a6) bg-(--admin-sidebar) md:flex">
          <AdminSidebarContent
            pathname={pathname}
            pageTitle={pageTitle}
            darkMode={darkMode}
            user={user}
            onToggleTheme={toggleTheme}
          />
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
          <AdminSidebarContent
            pathname={pathname}
            pageTitle={pageTitle}
            darkMode={darkMode}
            user={user}
            mobile
            onClose={closeMobileMenu}
            onToggleTheme={toggleTheme}
          />
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

function AdminSidebarContent({
  pathname,
  pageTitle,
  darkMode,
  user,
  mobile = false,
  onClose,
  onToggleTheme,
}: {
  pathname: string;
  pageTitle: string;
  darkMode: boolean;
  user: AdminShellProps["user"];
  mobile?: boolean;
  onClose?: () => void;
  onToggleTheme: () => void;
}) {
  return (
    <>
      <div className={`flex items-center justify-between ${mobile ? "p-4" : ""}`}>
        <AdminBrand compact={mobile} />
        {mobile && (
          <IconButton variant="ghost" aria-label="Close admin menu" onClick={onClose}>
            <X size={20} />
          </IconButton>
        )}
      </div>
      <Separator size="4" />
      <AdminContextHeader pageTitle={pageTitle} darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <Separator size="4" />
      <AdminNavigation pathname={pathname} onNavigate={onClose} />
      <AdminAccountFooter user={user} onNavigate={onClose} />
    </>
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
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Admin sections">
      <Text size="1" weight="bold" mb="2" className="px-3 uppercase tracking-wider text-(--admin-sidebar-muted)">
        Overview
      </Text>
      {overviewNavigation.map(({ href, label, icon: Icon }) => (
        <AdminLink key={href} href={href} label={label} icon={Icon} active={isActivePath(pathname, href)} onNavigate={onNavigate} />
      ))}

      {navigationGroups.map((group) => {
        const groupIsActive = group.items.some((item) => isActivePath(pathname, item.href));

        return (
          <details key={group.label} open={groupIsActive} className="group mt-1 w-full">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2.5 text-(--admin-sidebar-foreground) transition-colors hover:bg-(--admin-sidebar-hover) [&::-webkit-details-marker]:hidden">
              <span className="text-sm font-medium">{group.label}</span>
              <ChevronDown size={17} className="shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="ml-3 mt-1 flex w-full flex-col gap-1 border-l border-(--gray-a6) pl-2">
              {group.items.map(({ href, label, icon: Icon }) => (
                <AdminLink key={href} href={href} label={label} icon={Icon} active={isActivePath(pathname, href)} onNavigate={onNavigate} nested />
              ))}
            </div>
          </details>
        );
      })}
    </nav>
  );
}

function AdminAccountFooter({
  user,
  onNavigate,
}: {
  user: AdminShellProps["user"];
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const displayName = user.name?.trim() || "Administrator";
  const initials = displayName.slice(0, 1).toUpperCase();

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut({ redirect: false });
    localStorage.removeItem("tempCart");
    localStorage.removeItem("tempCartId");
    onNavigate?.();
    router.replace("/");
  }

  return (
    <div className="shrink-0 border-t border-(--gray-a6) p-3">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg p-2 text-(--admin-sidebar-foreground) transition-colors hover:bg-(--admin-sidebar-hover) [&::-webkit-details-marker]:hidden">
          {user.image ? (
            <img src={user.image} alt="" className="size-10 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="grid size-10 shrink-0 place-content-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
              {initials}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-xs font-semibold">{displayName}</strong>
            <span className="block truncate text-xs text-(--admin-sidebar-muted)">{user.email ?? "Administrator account"}</span>
          </span>
          <ChevronDown size={17} className="shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-2 flex w-full flex-col gap-1 rounded-lg border border-(--gray-a6) p-1">
          <Link href="/admin/profile" onClick={onNavigate} className="block rounded-md px-3 py-2 text-sm text-(--admin-sidebar-foreground) hover:bg-(--admin-sidebar-hover)">
            Profile
          </Link>
          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 disabled:opacity-60"
          >
            {isSigningOut ? "Signing out…" : "Sign out"}
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
      </details>
    </div>
  );
}

function AdminLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
  nested,
}: {
  href: string;
  label: string;
  icon: typeof LayoutPanelTopIcon;
  active: boolean;
  onNavigate?: () => void;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center justify-start gap-3 rounded-md px-3 py-2.5 text-left ${nested ? "text-sm" : ""} ${
        active
          ? "bg-(--admin-sidebar-active) text-(--admin-sidebar-active-foreground)"
          : "text-(--admin-sidebar-foreground) hover:bg-(--admin-sidebar-hover)"
      }`}
    >
      <Icon size={18} className="shrink-0" aria-hidden="true" />
      <span className="min-w-0 text-left text-sm font-medium">{label}</span>
    </Link>
  );
}
