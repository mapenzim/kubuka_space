import crypto from "crypto";

export function generateConversationKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashConversationKey(
  key: string,
): string {

  return crypto
    .createHash("sha256")
    .update(key)
    .digest("hex");

}