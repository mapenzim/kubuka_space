import { ApiClient } from "./api_client";

import {
  ConversationThreadResponse,
  HeartbeatRequest,
  InboxThreadsResponse,
  SendMessageRequest,
  SendMessageResponse,
  SetActivityRequest,
  StartConversationRequest,
  StartConversationResponse,
} from "./types";

export class ChatClient extends ApiClient {
  /**
   * Inbox
   */
  getThreads() {
    return this.get<InboxThreadsResponse>(
      "/api/chat/threads",
    );
  }

  /**
   * Single conversation
   */
  getThread(
    threadId: string,
  ) {
    return this.get<ConversationThreadResponse>(
      `/api/chat/thread/${threadId}`,
    );
  }

  /**
   * Create a new conversation
   */
  startConversation(
    request: StartConversationRequest,
  ) {
    return this.post<StartConversationResponse>(
      "/api/chat/start",
      request,
    );
  }

  /**
   * Send message
   */
  sendMessage(
    request: SendMessageRequest,
  ) {
    return this.post<SendMessageResponse>(
      "/api/chat/send",
      request,
    );
  }

  /**
   * Typing indicator
   */
  setActivity(
    request: SetActivityRequest,
  ) {
    return this.post(
      "/api/chat/activity",
      request,
    );
  }

  /**
   * Presence heartbeat
   */
  heartbeat(
    request: HeartbeatRequest,
  ) {
    return this.post(
      "/api/chat/heartbeat",
      request,
    );
  }
}
export const chatClient = new ChatClient();
