import {
  ActivityApi,
  SetActivityRequest,
} from "./activity_api";

class ActivityHttpClient
  implements ActivityApi
{
  async setActivity(
    request: SetActivityRequest,
  ): Promise<void> {
    const response = await fetch(
      "/api/chat/activity",
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

export const activityClient =
  new ActivityHttpClient();