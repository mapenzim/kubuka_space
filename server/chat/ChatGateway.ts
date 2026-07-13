import { chatService } from "./ChatService";

import { typingService } from "@/server/typing/TypingService";
import { presenceService } from "@/server/presence/PresenceService";
import { Role } from "../state/chatState";

export class ChatGateway {

  // =====================================================
  // USER
  // =====================================================

  async sendUserMessage(
    sender: string,
    email: string,
    content: string
  ) {
    return chatService.sendUserMessage(
      sender,
      email,
      content
    );
  }

  // =====================================================
  // ADMIN
  // =====================================================

  async sendAdminMessage(
    threadId: string,
    content: string
  ) {
    return chatService.sendAdminMessage(
      threadId,
      content
    );
  }

  // =====================================================
  // THREADS
  // =====================================================

  async getThread(
    threadId: string
  ) {
    return chatService.getThread(
      threadId
    );
  }

  async getThreads() {
    return chatService.getThreads();
  }

  async findThread(
    email: string
  ) {
    return chatService.findThread(
      email
    );
  }

  async markThreadRead(
    threadId: string
  ) {
    return chatService.markThreadRead(
      threadId
    );
  }

  async archiveThread(
    threadId: string
  ) {
    return chatService.archiveThread(
      threadId
    );
  }

  async deleteThread(
    threadId: string
  ) {
    return chatService.deleteThread(
      threadId
    );
  }

  // =====================================================
  // TYPING
  // =====================================================

  typingStarted(
    threadId: string,
    clientId: string
  ) {
    return typingService.start(
      threadId,
      clientId
    );
  }

  typingStopped(
    threadId: string,
    clientId: string
  ) {
    return typingService.stop(
      threadId,
      clientId
    );
  }

  // =====================================================
  // PRESENCE
  // =====================================================

  userConnected(
    threadId: string,
    clientId: string,
    role: Role,
    online: boolean,
  ) {
    return presenceService.connect(
      threadId,
      clientId,
      role,
      online
    );
  }

  userDisconnected(
    threadId: string,
    clientId: string
  ) {
    return presenceService.disconnect(
      threadId,
      clientId
    );
  }

  isOnline(
    threadId: string
  ) {
    return presenceService.isOnline(
      threadId
    );
  }
}

export const chatGateway =
  new ChatGateway();