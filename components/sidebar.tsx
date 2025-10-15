"use client";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import ThemeToggle from "./themeToggle";

export default function Sidebar() {
  const links = [
    { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { href: "/dashboard/users", icon: <Users className="w-5 h-5" />, label: "Users" },
    { href: "/dashboard/posts", icon: <FileText className="w-5 h-5" />, label: "Posts" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {icon} {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
