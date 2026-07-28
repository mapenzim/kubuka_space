import { ChatSessionProvider } from "@/lib/chat/session";
import { ReactNode } from "react";

export default function ContactLayout({ children }: {children: ReactNode} ) {
  return (
    <ChatSessionProvider role="user">
      {children}
    </ChatSessionProvider>
  );
}