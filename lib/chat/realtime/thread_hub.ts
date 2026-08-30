import { NotificationService } from "@/lib/notifications/notification_service";
import { SSEClient } from "@/lib/sse/sse_client";
import { SSEConnection } from "@/lib/sse/sse_connection";

interface HubClient {
  clientId: string;
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
    this.clients.set(client.connectionId, {
      clientId: client.id,
      threadId: client.threadId,
      connection: new SSEConnection(client),
    });
  }

  remove(connectionId: string): void {
    const client =
      this.clients.get(connectionId);

    if (!client) {
      return;
    }

    client.connection.close();
    this.clients.delete(connectionId);
  }

  //--------------------------------------------------------
  // Broadcasting
  //--------------------------------------------------------
  private broadcast(
    threadId: string,
    event: unknown,
  ): void {
    for (const [
      connectionId,
      client,
    ] of this.clients) {
      if (
        client.threadId !== threadId
      ) {
        continue;
      }

      try {
        client.connection.send(event);
      } catch {
        this.remove(connectionId);
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
