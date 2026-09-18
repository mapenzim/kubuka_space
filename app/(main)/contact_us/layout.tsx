import { ChatSessionProvider } from "@/lib/chat/session";
import { ReactNode } from "react";

export default function ContactLayout({ children }: {children: ReactNode} ) {
  return (
    <ChatSessionProvider role="user">
      <section className="min-h-[calc(100dvh-4rem)] bg-zinc-50 transition-colors dark:bg-zinc-950 md:min-h-dvh">
        {children}
      </section>
    </ChatSessionProvider>
  );
}
