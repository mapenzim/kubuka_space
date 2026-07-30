import { SenderRole } from "@/lib/interfaces";


export interface PresenceParticipant {
  threadId: string;
  clientId: string;
  role: SenderRole;
  online: boolean;
  connectedAt: string;
  lastSeen: string;
}

interface PresenceConnectInput {
  threadId: string;
  clientId: string;
  senderRole: SenderRole;
  online: boolean;
}

interface PresenceSnapshot {
  participants: PresenceParticipant[];
}

type Listener = () => void;

export class PresenceStore {
  //--------------------------------------------------------
  // State
  //--------------------------------------------------------

  private participants =
    new Map<
      string,
      PresenceParticipant
    >();

  private snapshotState: PresenceSnapshot =
    {
      participants: [],
    };

  private listeners =
    new Set<Listener>();

  //--------------------------------------------------------
  // React
  //--------------------------------------------------------

  subscribe = (
    listener: Listener,
  ) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify() {
    this.snapshotState = {
      participants: Array.from(
        this.participants.values(),
      ),
    };

    this.listeners.forEach(
      (listener) => listener(),
    );
  }

  snapshot = () =>
    this.snapshotState;

  //--------------------------------------------------------
  // Getters
  //--------------------------------------------------------

  getParticipants() {
    return this.snapshotState
      .participants;
  }

  getParticipant(
    clientId: string,
  ) {
    return this.participants.get(
      clientId,
    );
  }

  isOnline(
    clientId: string,
  ) {
    return (
      this.participants.get(
        clientId,
      )?.online ?? false
    );
  }

  hasParticipant(
    clientId: string,
  ) {
    return this.participants.has(
      clientId,
    );
  }

  //--------------------------------------------------------
  // Mutations
  //--------------------------------------------------------

  connect(
    participant: PresenceConnectInput,
  ) {
    const now =
      new Date().toISOString();

    this.participants.set(
      participant.clientId,
      {
        threadId: participant.threadId,
        clientId:
          participant.clientId,
        role:
          participant.senderRole,
        online:
          participant.online,
        connectedAt: now,
        lastSeen: now,
      },
    );

    this.notify();
  }

  disconnect(
    clientId: string,
  ) {
    const participant =
      this.participants.get(
        clientId,
      );

    if (!participant) {
      return;
    }

    this.participants.set(
      clientId,
      {
        ...participant,
        online: false,
        lastSeen:
          new Date().toISOString(),
      },
    );

    this.notify();
  }

  heartbeat(
    clientId: string,
  ) {
    const participant =
      this.participants.get(
        clientId,
      );

    if (!participant) {
      return;
    }

    this.participants.set(
      clientId,
      {
        ...participant,
        lastSeen:
          new Date().toISOString(),
      },
    );

    this.notify();
  }

  remove(
    clientId: string,
  ) {
    if (
      !this.participants.has(
        clientId,
      )
    ) {
      return;
    }

    this.participants.delete(
      clientId,
    );

    this.notify();
  }

  replace(
    participants: PresenceParticipant[],
  ) {
    this.participants.clear();

    for (const participant of participants) {
      this.participants.set(
        participant.clientId,
        participant,
      );
    }

    this.notify();
  }

  clear() {
    this.participants.clear();

    this.notify();
  }
}

export const presenceStore =
  new PresenceStore();