"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/sidebar";
import NotificationsProvider from "@/components/notificationsProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <NotificationsProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed md:static z-40 transform ${
            open ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:translate-x-0`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-auto">{children}</main>
      </div>
    </NotificationsProvider>
  );
}
