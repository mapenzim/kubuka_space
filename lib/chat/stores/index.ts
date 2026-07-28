import { activityStore } from "./activity_store";
import { conversationStore } from "./conversation_store";
import { presenceStore } from "./presence_store";

export const chatStores = {
  conversation: conversationStore,
  presence: presenceStore,
  activity: activityStore
}