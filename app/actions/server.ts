type Role = "user" | "admin";

export type Client = {
  id: string;
  userId?: string;
  role: Role;
  controller: ReadableStreamDefaultController;
};

const clients: Client[] = [];
const fallbackTimers = new Map<string, NodeJS.Timeout>();

// ---------------------------
// 📤 Send helper
// ---------------------------
export function send(client: Client, payload: any) {
  client.controller.enqueue(`data: ${JSON.stringify(payload)}\n\n`);
}

// ---------------------------
// 🧹 Cleanup
// ---------------------------
export function removeClient(id: string) {
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) clients.splice(index, 1);
}

// ---------------------------
// ⏱ Timer helpers
// ---------------------------
export function clearFallbackTimer(userId: string) {
  const timer = fallbackTimers.get(userId);
  if (timer) {
    clearTimeout(timer);
    fallbackTimers.delete(userId);
  }
}

function startFallbackTimer(userId: string) {
  clearFallbackTimer(userId);

  const timer = setTimeout(() => {
    const user = clients.find((c) => c.userId === userId);

    if (user) {
      send(user, {
        type: "bot",
        text: "Admin is taking longer. Here's some help...",
      });
    }

    fallbackTimers.delete(userId);
  }, 5 * 60 * 1000);

  fallbackTimers.set(userId, timer);
}

// ---------------------------
// ➕ Register client
// ---------------------------
export function addClient(client: Client) {
  clients.push(client);
}

// ---------------------------
// 📩 USER MESSAGE
// ---------------------------
export function handleUserMessage(sender: Client, text: string) {
  const admins = clients.filter((c) => c.role === "admin");

  if (admins.length > 0) {
    admins.forEach((admin) => {
      send(admin, {
        type: "message",
        from: sender.userId,
        text,
      });
    });

    startFallbackTimer(sender.userId!);
  } else {
    send(sender, {
      type: "bot",
      text: "No admin online. We'll get back to you soon.",
    });
  }
}

// ---------------------------
// 👨‍💼 ADMIN REPLY
// ---------------------------
export function handleAdminReply(userId: string, text: string) {
  const user = clients.find((c) => c.userId === userId);

  if (!user) return;

  send(user, {
    type: "message",
    from: "admin",
    text,
  });

  clearFallbackTimer(userId);
}