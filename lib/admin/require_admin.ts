import "server-only";

import { cache } from "react";

import { getActiveActor, requirePermission } from "@/lib/rbac/server";
import { hasPermission, PERMISSIONS } from "@/lib/rbac/policy";

export type AdminRole = "ADMIN" | "SUPERUSER";

export const getActiveAdmin = cache(async () => {
  const actor = await getActiveActor();
  return actor && hasPermission(actor.role, PERMISSIONS.ADMIN_DASHBOARD_READ)
    ? { ...actor, role: actor.role as AdminRole }
    : null;
});

export const getActiveBackofficeActor = cache(async () => {
  const actor = await getActiveActor();
  return actor && hasPermission(actor.role, PERMISSIONS.BLOG_READ_ANY)
    ? actor
    : null;
});

export async function requireAdmin() {
  const actor = await requirePermission(PERMISSIONS.ADMIN_DASHBOARD_READ);
  return { ...actor, role: actor.role as AdminRole };
}
