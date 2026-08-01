import { StreamClient } from "./stream_client";

export interface ConversationClient extends StreamClient {
  connectionId: string;
}
