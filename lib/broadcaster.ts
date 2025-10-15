/**
 * A lightweight broadcaster compatible with Edge and Node runtimes.
 * Uses BroadcastChannel (Web API) when available, or falls back to an in-memory emitter.
 */

type Message = { channel: string; type: string; payload: any };

export function getBroadcaster() {
  // ✅ Edge-safe BroadcastChannel version
  if (typeof globalThis.BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel("sse-broadcast");

    return {
      publish: (message: Message) => channel.postMessage(message),

      subscribe: (
        callback: (message: Message) => void,
        filterChannel?: string
      ) => {
        const handler = (event: MessageEvent) => {
          const msg = event.data as Message;
          if (!filterChannel || msg.channel === filterChannel) {
            callback(msg);
          }
        };
        channel.addEventListener("message", handler);
        return () => channel.removeEventListener("message", handler);
      },
    };
  }

  // ✅ Node fallback (for local dev)
  if (!(globalThis as any).__BROADCASTER__) {
    const { EventEmitter } = require("events");
    (globalThis as any).__BROADCASTER__ = new EventEmitter();
  }

  const emitter = (globalThis as any).__BROADCASTER__;

  return {
    publish: (message: Message) => emitter.emit("message", message),
    subscribe: (callback: (message: Message) => void, filterChannel?: string) => {
      const handler = (msg: Message) => {
        if (!filterChannel || msg.channel === filterChannel) callback(msg);
      };
      emitter.on("message", handler);
      return () => emitter.off("message", handler);
    },
  };
}
