import { NotificationService } from "@/lib/notifications/notification_service";
import { SSEClient } from "@/lib/sse/sse_client";
import { SSEConnection } from "@/lib/sse/sse_connection";

interface HubClient {
  threadId: string;
  connection: SSEConnection;
}

export class ThreadHub {
  private readonly clients =
    new Map<string, HubClient>();

  private readonly unsubscribe: () => void;

  constructor(
  notificationService: NotificationService,
) {
    const unsubscribe =
      notificationService.subscribeAllThread((event) => {
        this.broadcast(event.threadId, event);
      });
    this.unsubscribe = unsubscribe;

  }

  //--------------------------------------------------------
  // Client Management
  //--------------------------------------------------------
  add(client: SSEClient): void {
    this.clients.set(client.id, {
      threadId: client.threadId,
      connection: new SSEConnection(client),
    });
  }

  remove(clientId: string): void {
    const client =
      this.clients.get(clientId);

    if (!client) {
      return;
    }

    client.connection.close();
    this.clients.delete(clientId);
  }

  //--------------------------------------------------------
  // Broadcasting
  //--------------------------------------------------------
  private broadcast(
    threadId: string,
    event: unknown,
  ): void {
    for (const [
      clientId,
      client,
    ] of this.clients) {
      if (
        client.threadId !== threadId
      ) {
        continue;
      }

      try {
        client.connection.send(event);
      } catch (error) {
        this.remove(clientId);
      }
    }
  }

  //--------------------------------------------------------
  // Cleanup
  //--------------------------------------------------------
  clear(): void {
    for (const clientId of this.clients.keys()) {
      this.remove(clientId);
    }
  }

  dispose(): void {
    this.clear();
    this.unsubscribe();
  }
}