import { Role } from "../state/chatState";

export const PresenceState = {
  Online: "ONLINE",
  Away: "AWAY",
  Offline: "OFFLINE",
} as const;

export type PresenceState =
  (typeof PresenceState)[keyof typeof PresenceState];

export interface Presence {
  id: string;

  role: Role;

  state: PresenceState;

  connectedAt: Date;

  lastSeen: Date;
}