import { clearUserChatSession, getChatSessionRevision } from "./guest_session";

/** A denied poll must discard private data, not leave the last response visible. */
export function assertChatAccess(response: Response, revision: number) {
  if (response.status !== 401 && response.status !== 403) return;

  // Ignore a late rejection from a conversation/account already torn down.
  if (revision === getChatSessionRevision()) clearUserChatSession(false);
  throw new Error("This conversation is no longer accessible. Please sign in again.");
}
