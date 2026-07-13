import { wireChatEvents } from "@/server/chat/events";

let bootstrapped = false;

export function bootstrap() {
  if (bootstrapped) {
    return;
  }

  bootstrapped = true;

  wireChatEvents();

  console.log(
    "[Bootstrap] Chat system initialized."
  );
}