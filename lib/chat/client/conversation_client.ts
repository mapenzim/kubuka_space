import {
  ConversationThreadResponse,
  SendMessageResponse,
  StartConversationRequest,
} from "@/lib/api/types";
import {
  ConversationApi,
  SendMessageRequest,
  DeleteConversationRequest,
} from "./conversation_api";

class ConversationHttpClient
  implements ConversationApi
{
  async startConversation(
    request: StartConversationRequest,
  ): Promise<ConversationThreadResponse> {
    const response = await fetch(
      "/api/chat/start",
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

    return response.json();
  }

  async sendMessage(
    request: SendMessageRequest,
  ): Promise<SendMessageResponse> {
    const response = await fetch(
      "/api/chat/send",
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

    return response.json();
  }

  async delete(
    request: DeleteConversationRequest,
  ): Promise<void> {
    const response = await fetch(
      `/api/chat/thread/${request.threadId}/delete`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error(
        await response.text(),
      );
    }
  }

  async getThread(threadId: string, conversationKey?: string) {
    const params = new URLSearchParams();
    if (conversationKey) params.set("conversationKey", conversationKey);
    const query = params.size ? `?${params.toString()}` : "";
    const response = await fetch(
      `/api/chat/thread/${threadId}${query}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load conversation.",
      );
    }

    return response.json();
  }
}

export const conversationClient =
  new ConversationHttpClient();
