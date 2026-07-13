import { notificationService } from "@/server/chat/services/NotificationService";
import { Role } from "@/server/state/chatState";

import {
  presenceState,
  Presence,
} from "./PresenceState";

export class PresenceService {

  // =====================================================
  // CONNECT
  // =====================================================

  async connect(
    threadId: string,
    clientId: string,
    role: Role,
    online: boolean
  ) {
    presenceState.connect(
      threadId,
      clientId,
      role,
      online
    );

    const client = presenceState.get(
      threadId,
      clientId
    );

    if (!client) {
      return;
    }

    await notificationService.presenceChanged(
      threadId,
      client.role,
      true
    );
  }

  // =====================================================
  // DISCONNECT
  // =====================================================

  async disconnect(
    threadId: string,
    clientId: string
  ) {
    const client =
      presenceState.get(
        threadId,
        clientId
      );

    if (!client) {
      return;
    }

    presenceState.disconnect(
      threadId,
      clientId
    );

    const stillOnline =
      presenceState.isOnline(
        threadId,
        client.role
      );

    if (!stillOnline) {
      await notificationService.presenceChanged(
        threadId,
        client.role,
        false
      );
    }
  }

  // =====================================================
  // HEARTBEAT
  // =====================================================

  heartbeat(
    threadId: string,
    clientId: string
  ) {
    presenceState.heartbeat(
      threadId,
      clientId
    );
  }

  // =====================================================
  // FIND
  // =====================================================

  find(
    threadId: string,
    clientId: string
  ) {
    return presenceState.get(
      threadId,
      clientId
    );
  }

  all(
    threadId: string
  ): Presence[] {
    return presenceState.getThread(
      threadId
    );
  }

  byRole(
    threadId: string,
    role: Role
  ): Presence[] {
    return presenceState.getRole(
      threadId,
      role
    );
  }

  // =====================================================
  // STATUS
  // =====================================================

  isOnline(
    threadId: string,
    role?: Role
  ) {
    return presenceState.isOnline(
      threadId,
      role
    );
  }

  count(
    threadId?: string
  ) {
    return presenceState.count(
      threadId
    );
  }

  // =====================================================
  // CLEAR
  // =====================================================

  clearThread(
    threadId: string
  ) {
    presenceState.clearThread(
      threadId
    );
  }

  clear() {
    presenceState.clear();
  }
}

export const presenceService =
  new PresenceService();