import {
  AppRole,
  hasPermission,
  isAdministrativeRole,
  PERMISSIONS,
} from "@/lib/rbac/policy";

/** @deprecated Import AppRole from @/lib/rbac/policy in new code. */
export type Role = AppRole;

/** Compatibility helper for older modules while policy lives in one place. */
export const isAdminRole = isAdministrativeRole;

export const can = {
  createUser: (role: Role) => hasPermission(role, PERMISSIONS.USERS_CREATE),
  assignAdmin: (role: Role) => hasPermission(role, PERMISSIONS.USERS_CREATE_ADMIN),
  deleteUser: (role: Role) => hasPermission(role, PERMISSIONS.USERS_DELETE),
  createPost: (role: Role) => hasPermission(role, PERMISSIONS.BLOG_CREATE),
  deletePost: (role: Role) => hasPermission(role, PERMISSIONS.BLOG_DELETE_ANY),
  viewDashboard: (role: Role) => hasPermission(role, PERMISSIONS.ADMIN_DASHBOARD_READ),
};
