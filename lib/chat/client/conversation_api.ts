import {
  ConversationThreadResponse,
  SendMessageResponse,
  StartConversationRequest,
  StartConversationResponse,
} from "@/lib/api/types";

export interface SendMessageRequest {
  threadId: string;
  content: string;
  senderRole: string;
  conversationKey?: string;
}

export interface DeleteConversationRequest {
  threadId: string;
}

export interface ConversationApi {
  getThread(
    threadId: string,
    conversationKey?: string,
  ): Promise<ConversationThreadResponse>;

  startConversation(
    request: StartConversationRequest,
  ): Promise<StartConversationResponse>;

  sendMessage(
    request: SendMessageRequest,
  ): Promise<SendMessageResponse>;

  delete(
    request: DeleteConversationRequest,
  ): Promise<void>;

  archive(
    request: DeleteConversationRequest,
  ): Promise<void>;
}
