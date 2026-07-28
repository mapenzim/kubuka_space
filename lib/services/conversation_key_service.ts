import { randomBytes, timingSafeEqual } from "crypto";

import bcrypt from "bcryptjs";

export class ConversationKeyService {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Generates a cryptographically secure conversation key.
   * This plain key is returned to the client and should never
   * be stored in the database.
   */
  generate(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * Hashes the conversation key for persistence.
   */
  async hash(
    conversationKey: string,
  ): Promise<string> {
    return bcrypt.hash(
      conversationKey,
      ConversationKeyService.SALT_ROUNDS,
    );
  }

  /**
   * Verifies a supplied conversation key against
   * the stored hash.
   */
  async verify(
    conversationKey: string,
    conversationKeyHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(
      conversationKey,
      conversationKeyHash,
    );
  }

  /**
   * Constant-time comparison for non-hashed values
   * (useful if you later introduce signed tokens).
   */
  safeEquals(
    left: string,
    right: string,
  ): boolean {
    const a = Buffer.from(left);
    const b = Buffer.from(right);

    if (a.length !== b.length) {
      return false;
    }

    return timingSafeEqual(a, b);
  }
}