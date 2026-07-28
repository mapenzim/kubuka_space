import { StreamClient } from "./stream_client";

export interface SSEClient extends StreamClient {
  threadId: string;
}

export interface ConversationClient
  extends StreamClient {}