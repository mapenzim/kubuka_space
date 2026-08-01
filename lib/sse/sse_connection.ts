import { StreamClient } from "./stream_client";

export class SSEConnection {
  constructor(
    private readonly client: StreamClient,
  ) {}

  send(data: unknown): void {
    try {
      this.client.stream.enqueue(
        `data: ${JSON.stringify(data)}\n\n`,
      );
    } catch {
      // The browser or framework may have closed the stream already.
      // The hub will remove this connection after the failed write.
      throw new Error("SSE stream is closed");
    }
  }

  close(): void {
    try {
      this.client.stream.close();
    } catch {
      // The request may already have been cancelled by the browser or
      // framework. Closing an SSE connection must always be idempotent.
    }
  }
}
