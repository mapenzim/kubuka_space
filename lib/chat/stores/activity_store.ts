import { ActivityType } from "@/lib/activity/activity";
import { SenderRole } from "@/lib/interfaces";

export interface ActivityParticipant {
  clientId: string;
  role: SenderRole;
  activity: ActivityType;
  updatedAt: string;
}

interface SetActivityInput {
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
    clientId: string,
  ) {
    return this.participants.get(
      clientId,
    )?.activity;
  }

   isTyping(role: SenderRole) {
    return this.snapshotState.participants.some(
      (participant) =>
        participant.role === role &&
        participant.activity === ActivityType.TYPING,
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
    this.participants.set(
      participant.clientId,
      {
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
    participants: ActivityParticipant[],
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

export const activityStore =
  new ActivityStore();