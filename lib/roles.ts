export type Role = "SUPERUSER" | "ADMIN" | "EDITOR" | "USER";

export const can = {
  createUser: (role: Role) => role === "ADMIN" || role === "SUPERUSER",
  deleteUser: (role: Role) => role === "ADMIN" || role === "SUPERUSER",
  createPost: (role: Role) => role === "ADMIN" || role === "EDITOR",
  deletePost: (role: Role) => role === "ADMIN" || role === "SUPERUSER",
  viewDashboard: (role: Role) => role === "ADMIN" || role === "EDITOR",
};
