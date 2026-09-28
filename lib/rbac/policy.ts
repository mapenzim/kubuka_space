/**
 * Kubuka Space role-based access control policy.
 *
 * Keep this module free of server-only imports so the same decisions can be
 * used by middleware and client UI. Server actions and API routes must still
 * enforce permissions with lib/rbac/server.ts; hiding a control is not access
 * control.
 */
export const APP_ROLES = [
  "SUPERUSER",
  "ADMIN",
  "EDITOR",
  "USER",
  "GUEST",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const PERMISSIONS = {
  PUBLIC_READ: "public:read",
  ACCOUNT_CREATE_SELF: "account:create:self",
  PROFILE_MANAGE_SELF: "profile:manage:self",
  CART_MANAGE_SELF: "cart:manage:self",
  CART_MANAGE_GUEST: "cart:manage:guest",
  ORDER_MANAGE_SELF: "order:manage:self",
  CONTACT_CREATE: "contact:create",
  CONTACT_MANAGE_SELF: "contact:manage:self",
  CONTACT_MANAGE_ANY: "contact:manage:any",
  BLOG_CREATE: "blog:create",
  BLOG_READ_ANY: "blog:read:any",
  BLOG_UPDATE_ANY: "blog:update:any",
  BLOG_ARCHIVE_ANY: "blog:archive:any",
  BLOG_DELETE_ANY: "blog:delete:any",
  USERS_CREATE: "users:create",
  USERS_CREATE_ADMIN: "users:create:admin",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_ARCHIVE: "users:archive",
  USERS_DELETE: "users:delete",
  STORE_MANAGE: "store:manage",
  ORDERS_MANAGE_ANY: "orders:manage:any",
  NOTIFICATIONS_MANAGE: "notifications:manage",
  SNIPPETS_MANAGE: "snippets:manage",
  ADMIN_DASHBOARD_READ: "admin:dashboard:read",
  ADMIN_PROFILE_MANAGE: "admin:profile:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];

const ROLE_PERMISSIONS: Record<AppRole, ReadonlySet<Permission>> = {
  SUPERUSER: new Set(ALL_PERMISSIONS),
  ADMIN: new Set([
    PERMISSIONS.PUBLIC_READ,
    PERMISSIONS.ACCOUNT_CREATE_SELF,
    PERMISSIONS.PROFILE_MANAGE_SELF,
    PERMISSIONS.CART_MANAGE_SELF,
    PERMISSIONS.ORDER_MANAGE_SELF,
    PERMISSIONS.CONTACT_CREATE,
    PERMISSIONS.CONTACT_MANAGE_SELF,
    PERMISSIONS.CONTACT_MANAGE_ANY,
    PERMISSIONS.BLOG_CREATE,
    PERMISSIONS.BLOG_READ_ANY,
    PERMISSIONS.BLOG_UPDATE_ANY,
    PERMISSIONS.BLOG_ARCHIVE_ANY,
    PERMISSIONS.BLOG_DELETE_ANY,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_ARCHIVE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.STORE_MANAGE,
    PERMISSIONS.ORDERS_MANAGE_ANY,
    PERMISSIONS.NOTIFICATIONS_MANAGE,
    PERMISSIONS.SNIPPETS_MANAGE,
    PERMISSIONS.ADMIN_DASHBOARD_READ,
    PERMISSIONS.ADMIN_PROFILE_MANAGE,
  ]),
  EDITOR: new Set([
    PERMISSIONS.PUBLIC_READ,
    PERMISSIONS.PROFILE_MANAGE_SELF,
    PERMISSIONS.CART_MANAGE_SELF,
    PERMISSIONS.ORDER_MANAGE_SELF,
    PERMISSIONS.CONTACT_CREATE,
    PERMISSIONS.CONTACT_MANAGE_SELF,
    PERMISSIONS.BLOG_CREATE,
    PERMISSIONS.BLOG_READ_ANY,
    PERMISSIONS.BLOG_UPDATE_ANY,
    PERMISSIONS.BLOG_ARCHIVE_ANY,
    PERMISSIONS.BLOG_DELETE_ANY,
  ]),
  USER: new Set([
    PERMISSIONS.PUBLIC_READ,
    PERMISSIONS.ACCOUNT_CREATE_SELF,
    PERMISSIONS.PROFILE_MANAGE_SELF,
    PERMISSIONS.CART_MANAGE_SELF,
    PERMISSIONS.ORDER_MANAGE_SELF,
    PERMISSIONS.CONTACT_CREATE,
    PERMISSIONS.CONTACT_MANAGE_SELF,
  ]),
  GUEST: new Set([
    PERMISSIONS.PUBLIC_READ,
    PERMISSIONS.ACCOUNT_CREATE_SELF,
    PERMISSIONS.CART_MANAGE_GUEST,
    PERMISSIONS.CONTACT_CREATE,
    PERMISSIONS.CONTACT_MANAGE_SELF,
  ]),
};

export function isAppRole(role: unknown): role is AppRole {
  return typeof role === "string" && APP_ROLES.includes(role as AppRole);
}

export function normalizeRole(role: unknown): AppRole {
  return isAppRole(role) ? role : "GUEST";
}

export function hasPermission(role: unknown, permission: Permission): boolean {
  return ROLE_PERMISSIONS[normalizeRole(role)].has(permission);
}

export function permissionsForRole(role: AppRole): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

export function isAdministrativeRole(role: unknown): role is "SUPERUSER" | "ADMIN" {
  return role === "SUPERUSER" || role === "ADMIN";
}

export function isBackofficeRole(role: unknown): role is "SUPERUSER" | "ADMIN" | "EDITOR" {
  return isAdministrativeRole(role) || role === "EDITOR";
}

export function canAssignRole(actorRole: unknown, requestedRole: unknown): requestedRole is Exclude<AppRole, "GUEST" | "SUPERUSER"> {
  const actor = normalizeRole(actorRole);
  const requested = normalizeRole(requestedRole);

  if (requested === "GUEST" || requested === "SUPERUSER") return false;
  if (!hasPermission(actor, PERMISSIONS.USERS_CREATE)) return false;
  if (requested === "ADMIN") {
    return hasPermission(actor, PERMISSIONS.USERS_CREATE_ADMIN);
  }
  return requested === "USER" || requested === "EDITOR";
}

export function canManageUserRole(actorRole: unknown, targetRole: unknown): boolean {
  const actor = normalizeRole(actorRole);
  const target = normalizeRole(targetRole);

  if (target === "SUPERUSER") return false;
  return actor === "SUPERUSER" || actor === "ADMIN";
}

/** Route policy for the protected portions of the application. */
export function canAccessProtectedPath(role: unknown, pathname: string): boolean {
  const normalizedRole = normalizeRole(role);

  if (pathname === "/admin/posts" || pathname.startsWith("/admin/posts/")) {
    return hasPermission(normalizedRole, PERMISSIONS.BLOG_READ_ANY);
  }

  if (pathname.startsWith("/admin")) {
    return hasPermission(normalizedRole, PERMISSIONS.ADMIN_DASHBOARD_READ);
  }

  if (pathname.startsWith("/dashboard")) {
    return hasPermission(normalizedRole, PERMISSIONS.ADMIN_DASHBOARD_READ);
  }

  if (pathname.startsWith("/profile")) {
    return normalizedRole !== "GUEST" && hasPermission(normalizedRole, PERMISSIONS.PROFILE_MANAGE_SELF);
  }

  return true;
}

export function defaultRouteForRole(role: unknown): string {
  const normalizedRole = normalizeRole(role);
  if (hasPermission(normalizedRole, PERMISSIONS.ADMIN_DASHBOARD_READ)) return "/admin";
  if (hasPermission(normalizedRole, PERMISSIONS.BLOG_READ_ANY)) return "/admin/posts";
  return "/";
}
