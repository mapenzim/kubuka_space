import { ConversationEvent } from "../events/conversation/conversation_event";

export interface ConversationCallbacks {
  onOpen?(): void;

  onClose?(): void;

  onError?(error: Event): void;

  onEvent(
    event: ConversationEvent,
  ): void;
}

export class ConversationClient {
  private source?: EventSource;

  connect(
    clientId: string,
    callbacks: ConversationCallbacks,
  ) {
    this.disconnect();

    this.source =
      new EventSource(
        `/api/chat/conversations/events?clientId=${clientId}`,
      );

    this.source.addEventListener(
      "connected",
      () => {
        callbacks.onOpen?.();
      },
    );

    this.source.onopen =
      callbacks.onOpen ?? null;

    this.source.onerror =
      (event) => {
        callbacks.onError?.(event);
      };

    this.source.onmessage = (event) => {
      try {
        callbacks.onEvent(
          JSON.parse(event.data),
        );
      } catch (error) {
        console.error(
          "Invalid conversation event",
          error,
        );
      }
    };
  }

  disconnect() {
    this.source?.close();

    this.source =
      undefined;
  }
}
