"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { Bell } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
};

const NotificationsContext = createContext({
  notifications: [] as Notification[],
});

export function useNotifications() {
  return useContext(NotificationsContext);
}

export default function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    // initial load
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d));

    const es = new EventSource("/api/stream");

    const handler = (type: string) => (e: MessageEvent) => {
      const payload = JSON.parse(e.data);
      const note = {
        id: payload.id ?? Date.now(),
        title: payload.title ?? type,
        body: payload.body ?? JSON.stringify(payload),
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [note, ...prev]);
      setToasts((prev) => [note, ...prev].slice(0, 5));
    };

    es.addEventListener("notification", handler("notification"));
    es.addEventListener("post", handler("post"));
    es.addEventListener("user", handler("user"));

    return () => es.close();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      <div className="relative">
        <NavbarBell />
        {children}
      </div>
      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))}
      />
    </NotificationsContext.Provider>
  );
}

// 🔔 Notification bell with dropdown list
function NavbarBell() {
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const unread = notifications.length;

  return (
    <div className="absolute top-4 right-6">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 bg-white rounded-full shadow hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unread > 0 && (
          <span className="absolute top-0 right-0 block w-3 h-3 bg-red-600 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl border rounded-xl z-50">
          <div className="p-3 border-b font-semibold text-gray-800">
            Notifications ({unread})
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">
                No notifications yet
              </div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 border-b hover:bg-gray-50 text-left"
              >
                <div className="font-semibold text-gray-800">{n.title}</div>
                <div className="text-sm text-gray-600">{n.body}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 💬 Toast popups
function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Notification[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg w-80 border border-gray-700"
        >
          <div className="font-bold">{t.title}</div>
          <div className="text-sm opacity-80">{t.body}</div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-xs underline mt-2 text-gray-400"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
