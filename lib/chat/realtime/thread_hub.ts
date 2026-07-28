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

  console.log(
    "[ThreadHub] unsubscribe:",
    typeof unsubscribe,
    unsubscribe,
  );

  this.unsubscribe = unsubscribe;

  console.log(
    "[ThreadHub] initialized",
    this,
  );
}

  /*constructor(
    notificationService: NotificationService,
  ) {
    console.log(
      "[SSEHub] instance",
      this,
    );
    this.unsubscribe =
      notificationService.subscribeAll(
        (event) => {
          this.broadcast(
            event.threadId,
            event,
          );
        },
      );
  }*/
  

  //--------------------------------------------------------
  // Client Management
  //--------------------------------------------------------
  add(client: SSEClient): void {
    console.log(
      "[SSEHub] add",
      client.id,
      client.threadId,
    );
    console.log(
      "[SSEHub] add",
      this,
      client.id,
    );

    this.clients.set(client.id, {
      threadId: client.threadId,
      connection: new SSEConnection(client),
    });

    console.log(
      "[SSEHub] total",
      this.clients.size,
    );
  }

  remove(clientId: string): void {
    console.log(
      "[SSEHub] remove",
      clientId,
    );
    const client =
      this.clients.get(clientId);

    if (!client) {
      console.log(
        "[SSEHub] remove ignored",
        clientId,
      );
      return;
    }

    client.connection.close();
    this.clients.delete(clientId);
    console.log(
      "[SSEHub] total",
      this.clients.size,
    );
  }

  //--------------------------------------------------------
  // Broadcasting
  //--------------------------------------------------------
  private broadcast(
    threadId: string,
    event: unknown,
  ): void {
    console.log(
      "[ThreadHub] broadcast",
      this,
      this.clients.size,
    );
    console.log(
      "[SSEHub]",
      "clients:",
      this.clients.size,
      "thread:",
      threadId,
      event,
    );
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
      console.error(
        "[SSEHub] send failed",
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