import { Presence } from "./PresenceModel";

export class PresenceRepository {
  private static users = new Map<
    string,
    Presence
  >();

  static set(presence: Presence) {
    this.users.set(
      presence.id,
      presence
    );
  }

  static get(id: string) {
    return this.users.get(id);
  }

  static remove(id: string) {
    this.users.delete(id);
  }

  static all() {
    return [...this.users.values()];
  }

  static admins() {
    return this.all().filter(
      (u) => u.role === "admin"
    );
  }

  static onlineAdmins() {
    return this.admins().filter(
      (u) => u.state === "ONLINE"
    );
  }
}