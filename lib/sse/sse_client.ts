import { StreamClient } from "./stream_client";

export interface SSEClient extends StreamClient {
  connectionId: string;
  threadId: string;
}

export interface ConversationClient
  extends StreamClient {
  connectionId: string;
}
