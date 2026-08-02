"use client";

import { getUserSupportUnreadCount } from "@/app/actions/messageThreadAction";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SupportNotificationLink() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let active = true;
    const refresh = async () => { const next = await getUserSupportUnreadCount(); if (active) setCount(next); };
    refresh();
    const timer = window.setInterval(refresh, 30000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  return <Link href="/contact_us" aria-label={count ? `${count} unread support messages` : "Support messages"} className="relative inline-flex p-2">
    <Bell size={19} />
    {count > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] text-white">{count > 9 ? "9+" : count}</span>}
  </Link>;
}
