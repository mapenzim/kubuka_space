import { ActivityType } from "@/lib/activity/activity";
import { SenderRole } from "@/lib/interfaces";

export interface ActivityParticipant {
  threadId: string;
  clientId: string;
  role: SenderRole;
  activity: ActivityType;
  updatedAt: string;
}

interface SetActivityInput {
  threadId: string;
  clientId: string;
  senderRole: SenderRole;
  activity: ActivityType;
}

interface ActivitySnapshot {
  participants: ActivityParticipant[];
}

type Listener = () => void;

export class ActivityStore {
  //--------------------------------------------------------
  // State
  //--------------------------------------------------------

  private participants =
    new Map<
      string,
      ActivityParticipant
    >();

  private snapshotState: ActivitySnapshot =
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

  getActivity(
    threadId: string | undefined,
    clientId: string,
  ) {
    if (!threadId) return undefined;
    return this.participants.get(
      this.key(threadId, clientId),
    )?.activity;
  }

  isTyping(
    threadId: string | undefined,
    role: SenderRole,
  ) {
    if (!threadId) return false;

    return this.snapshotState.participants.some(
      (participant) =>
        participant.threadId === threadId &&
        participant.role === role &&
        participant.activity === ActivityType.TYPING &&
        Date.now() - new Date(participant.updatedAt).getTime() <= 6_000,
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

  setActivity(
    participant: SetActivityInput,
  ) {
    const key = this.key(
      participant.threadId,
      participant.clientId,
    );

    if (participant.activity === ActivityType.IDLE) {
      this.participants.delete(key);
      this.notify();
      return;
    }

    this.participants.set(
      key,
      {
        threadId: participant.threadId,
        clientId:
          participant.clientId,
        role:
          participant.senderRole,
        activity:
          participant.activity,
        updatedAt:
          new Date().toISOString(),
      },
    );

    this.notify();
  }

  clearActivity(
    threadId: string,
    clientId: string,
  ) {
    const key = this.key(threadId, clientId);
    if (
      !this.participants.has(
        key,
      )
    ) {
      return;
    }

    this.participants.delete(
      key,
    );

    this.notify();
  }

  replace(
    participants: ActivityParticipant[],
  ) {
    this.participants.clear();

    for (const participant of participants) {
      this.participants.set(
        this.key(participant.threadId, participant.clientId),
        participant,
      );
    }

    this.notify();
  }

  clear() {
    this.participants.clear();

    this.notify();
  }

  expireStale(maxAgeMs = 6_000) {
    const now = Date.now();
    let changed = false;

    for (const [key, participant] of this.participants) {
      if (
        participant.activity === ActivityType.TYPING &&
        now - new Date(participant.updatedAt).getTime() > maxAgeMs
      ) {
        this.participants.delete(key);
        changed = true;
      }
    }

    if (changed) this.notify();
  }

  private key(threadId: string, clientId: string) {
    return `${threadId}:${clientId}`;
  }
}

export const activityStore =
  new ActivityStore();
