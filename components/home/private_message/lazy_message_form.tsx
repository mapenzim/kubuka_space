"use client";

import dynamic from "next/dynamic";

const MessageForm = dynamic(
  () => import("./message_form").then((module) => module.MessageForm),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-72 animate-pulse rounded-lg bg-white/10"
        aria-label="Loading secure contact form"
      />
    ),
  },
);

export default function LazyMessageForm() {
  return <MessageForm />;
}
