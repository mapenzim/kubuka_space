"use client";

import { getUserSupportUnreadCount } from "@/app/actions/messageThreadAction";
import { MessageSquareMoreIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SupportNotificationLink({
  label,
}: {
  label?: string;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let active = true;
    let refreshing = false;
    const refresh = async () => {
      if (refreshing || document.visibilityState === "hidden") return;
      refreshing = true;
      try {
        const next = await getUserSupportUnreadCount();
        if (active) setCount(next);
      } finally {
        refreshing = false;
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60000);
    const handleFocus = () => void refresh();
    window.addEventListener("focus", handleFocus);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
  return <Link href="/contact_us" aria-label={count ? `${count} unread support messages` : "Support messages"} className="relative inline-flex items-center gap-2 p-2">
    <MessageSquareMoreIcon size={28} />
    {label && <span>{label}</span>}
    {count > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] text-white">{count > 9 ? "9+" : count}</span>}
  </Link>;
}
