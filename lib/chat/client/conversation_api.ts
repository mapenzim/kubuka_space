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

export interface ArchiveConversationRequest {
  threadId: string;
}

export interface DeleteConversationRequest {
  threadId: string;
}

export interface MarkReadRequest {
  threadId: string;
}

export interface ConversationApi {
  startConversation(
    request: StartConversationRequest,
  ): Promise<ConversationThreadResponse>;

  sendMessage(
    request: SendMessageRequest,
  ): Promise<SendMessageResponse>;

  archive(
    request: ArchiveConversationRequest,
  ): Promise<void>;

  delete(
    request: DeleteConversationRequest,
  ): Promise<void>;

  markRead(
    request: MarkReadRequest,
  ): Promise<void>;
}
