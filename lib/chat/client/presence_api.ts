import {
  ConnectRequest,
  DisconnectRequest,
} from "@/lib/api/types";

export interface HeartbeatRequest {
  threadId: string;
  clientId: string;
}

export interface PresenceApi {
  connect(
    request: ConnectRequest,
  ): Promise<void>;

  heartbeat(
    request: HeartbeatRequest,
  ): Promise<void>;

  disconnect(
    request: DisconnectRequest,
  ): Promise<void>;
}