import AdminMessenger from "@/components/chat/admin/AdminMessenger";
import { ChatSessionProvider } from "@/lib/chat/session";

export default function AdminMessagesPage() {
  return (
    <ChatSessionProvider role="admin">
      <AdminMessenger />
    </ChatSessionProvider>
  );
}