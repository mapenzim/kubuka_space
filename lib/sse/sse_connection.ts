import { StreamClient } from "./stream_client";

export class SSEConnection {
  constructor(
    private readonly client: StreamClient,
  ) {}

  send(data: unknown): void {
    this.client.stream.enqueue(
      `data: ${JSON.stringify(data)}\n\n`,
    );
  }

  close(): void {
    this.client.stream.close();
  }
}