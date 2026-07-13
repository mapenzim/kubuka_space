import { notificationService } from "@/server/chat/services/NotificationService";

import {
  typingState,
  TypingUser,
} from "./TypingState";

export class TypingService {
  private readonly timeout =
    5000;

  // =====================================================
  // START
  // =====================================================

  async start(
    threadId: string,
    clientId: string
  ) {
    const alreadyTyping =
      typingState.isTyping(
        threadId,
        clientId
      );

    typingState.start(
      threadId,
      clientId,
      this.timeout
    );

    if (!alreadyTyping) {
      await notificationService.typingStarted(
        threadId,
        clientId
      );
    }
  }

  // =====================================================
  // STOP
  // =====================================================

  async stop(
    threadId: string,
    clientId: string
  ) {
    const typing =
      typingState.isTyping(
        threadId,
        clientId
      );

    if (!typing) {
      return;
    }

    typingState.stop(
      threadId,
      clientId
    );

    await notificationService.typingStopped(
      threadId,
      clientId
    );
  }

  // =====================================================
  // REFRESH
  // =====================================================

  refresh(
    threadId: string,
    clientId: string
  ) {
    typingState.refresh(
      threadId,
      clientId,
      this.timeout
    );
  }

  // =====================================================
  // FIND
  // =====================================================

  find(
    threadId: string,
    clientId: string
  ) {
    return typingState.get(
      threadId,
      clientId
    );
  }

  all(
    threadId: string
  ): TypingUser[] {
    return typingState.getThread(
      threadId
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  isTyping(
    threadId: string,
    clientId?: string
  ) {
    return typingState.isTyping(
      threadId,
      clientId
    );
  }

  count(
    threadId?: string
  ) {
    return typingState.count(
      threadId
    );
  }

  // =====================================================
  // CLEANUP
  // =====================================================

  cleanup() {
    typingState.cleanup();
  }

  clearThread(
    threadId: string
  ) {
    typingState.clearThread(
      threadId
    );
  }

  clear() {
    typingState.clear();
  }
}

export const typingService =
  new TypingService();