import { NotificationService } from "@/lib/notifications/notification_service";
import { ConversationClient } from "@/lib/sse/conversation_client";
import { SSEConnection } from "@/lib/sse/sse_connection";
import { ConversationEvent } from "../events/conversation/conversation_event";

interface HubClient {
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
    this.clients.set(client.id, {
      connection: new SSEConnection(client),
    });
  }

  remove(
    clientId: string,
  ): void {
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
    event: ConversationEvent,
  ): void {
    for (const [
      clientId,
      client,
    ] of this.clients) {
      try {
        client.connection.send(event);
      } catch (error) {
        console.error(
          "[ConversationHub]",
          clientId,
          error,
        );

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
