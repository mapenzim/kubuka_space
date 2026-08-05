"use client";

import { markUserSupportRead } from "@/app/actions/messageThreadAction";
import { useEffect } from "react";

/** Marks support replies read only after the support page has opened in the browser. */
export default function ContactReadMarker({ userId }: { userId: string | null }) {
  useEffect(() => {
    if (userId) {
      void markUserSupportRead();
    }
  }, [userId]);

  return null;
}
