import {
  ConnectRequest,
  DisconnectRequest,
} from "@/lib/api/types";

import {
  HeartbeatRequest,
  PresenceApi,
} from "./presence_api";

class PresenceHttpClient
  implements PresenceApi
{
  async connect(
    request: ConnectRequest,
  ): Promise<void> {
    const response = await fetch(
      "/api/chat/connect",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          request,
        ),
      },
    );

    if (!response.ok) {
      throw new Error(
        await response.text(),
      );
    }
  }

  async heartbeat(
    request: HeartbeatRequest,
  ): Promise<void> {
    const response = await fetch(
      "/api/chat/heartbeat",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          request,
        ),
      },
    );

    if (!response.ok) {
      throw new Error(
        await response.text(),
      );
    }
  }

  async disconnect(
    request: DisconnectRequest,
  ): Promise<void> {
    const response = await fetch(
      "/api/chat/disconnect",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          request,
        ),
      },
    );

    if (!response.ok) {
      throw new Error(
        await response.text(),
      );
    }
  }
}

export const presenceClient =
  new PresenceHttpClient();