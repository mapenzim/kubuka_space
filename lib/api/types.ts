import { MessageDto, ThreadDto } from "../dto";
import { ThreadDetailsDto } from "../dto/thread_details_dto";
import { ThreadSummaryDto } from "../dto/thread_summary_dto";
import { SenderRole } from "../interfaces";
import { ApiResponse } from "./response";

export interface SendMessageRequest {
  threadId: string;
  senderRole: SenderRole;
  content: string;
  conversationKey?: string;
}

export interface SetActivityRequest {
  threadId: string;
  clientId: string;
  activity: string;
  conversationKey?: string;
}

export interface HeartbeatRequest {
  threadId: string;
  clientId: string;
  conversationKey?: string;
}

export interface StartConversationRequest {
  sender: string;
  email: string;
  content: string;
  conversationKey?: string;
}

export interface ConnectRequest {
  threadId: string;
  clientId: string;
  role: SenderRole;
  conversationKey?: string;
}

export interface DisconnectRequest {
  threadId: string;
  clientId: string;
  conversationKey?: string;
}

export type ThreadResponse = ApiResponse<ThreadDto>;

export type ConversationThreadResponse = ApiResponse<ThreadDetailsDto>;

export type InboxThreadsResponse = ApiResponse<ThreadSummaryDto[]>;

export type SendMessageResponse = ApiResponse<MessageDto>;

export type StartConversationResponse = ApiResponse<ThreadDetailsDto>;
