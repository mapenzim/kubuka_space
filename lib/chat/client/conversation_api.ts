import {
  ConversationThreadResponse,
  SendMessageResponse,
  StartConversationRequest,
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
  startConversation(
    request: StartConversationRequest,
  ): Promise<ConversationThreadResponse>;

  sendMessage(
    request: SendMessageRequest,
  ): Promise<SendMessageResponse>;

  delete(
    request: DeleteConversationRequest,
  ): Promise<void>;
}
