import { NotificationService } from "@/lib/notifications/notification_service";
import { ConversationClient } from "@/lib/sse/conversation_client";
import { SSEConnection } from "@/lib/sse/sse_connection";
import { ConversationEvent } from "../events/conversation/conversation_event";

interface HubClient {
  clientId: string;
  connection: SSEConnection;
}

export class ConversationHub {
  private readonly clients =
    new Map<string, HubClient>();

  private readonly unsubscribe: () => void;

  constructor(
    notificationService: NotificationService,
  ) {
    this.unsubscribe =
      notificationService.subscribeConversationStream(
        (event: ConversationEvent) =>
          this.broadcast(event),
      );
  }

  //--------------------------------------------------------
  // Client Management
  //--------------------------------------------------------

  add(
    client: ConversationClient,
  ): void {
    this.clients.set(client.connectionId, {
      clientId: client.id,
      connection: new SSEConnection(client),
    });
  }

  remove(
    connectionId: string,
  ): void {
    const client =
      this.clients.get(connectionId);

    if (!client) {
      return;
    }

    this.clients.delete(connectionId);
    client.connection.close();
  }

  //--------------------------------------------------------
  // Broadcasting
  //--------------------------------------------------------

  private broadcast(
    event: ConversationEvent,
  ): void {
    for (const [
      connectionId,
      client,
    ] of this.clients) {
      try {
        client.connection.send(event);
      } catch (error) {
        console.error(
          "[ConversationHub]",
          connectionId,
          error,
        );

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
