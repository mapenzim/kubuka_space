export type Role = "SUPERUSER" | "ADMIN" | "EDITOR" | "USER";

/** Roles that may enter and operate the administrative application. */
export function isAdminRole(role: unknown): role is "SUPERUSER" | "ADMIN" {
  return role === "ADMIN" || role === "SUPERUSER";
}

export const can = {
  createUser: (role: Role) => role === "ADMIN" || role === "SUPERUSER",
  deleteUser: (role: Role) => role === "ADMIN" || role === "SUPERUSER",
  createPost: (role: Role) => role === "ADMIN" || role === "EDITOR",
  deletePost: (role: Role) => role === "ADMIN" || role === "SUPERUSER",
  viewDashboard: (role: Role) => role === "ADMIN" || role === "EDITOR",
};
