import "server-only";

import { cache } from "react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  AppRole,
  hasPermission,
  isAppRole,
  Permission,
} from "@/lib/rbac/policy";

export type RbacActor = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Exclude<AppRole, "GUEST">;
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
};

export class AuthorizationError extends Error {
  readonly status = 403;

  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Resolve every authenticated actor from the database. JWT role data is useful
 * for presentation, but it is never the authority for a protected mutation.
 */
export const getActiveActor = cache(async (): Promise<RbacActor | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const account = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      status: true,
      role: { select: { name: true } },
    },
  });

  if (
    !account ||
    account.status !== "ACTIVE" ||
    !isAppRole(account.role?.name) ||
    account.role.name === "GUEST"
  ) {
    return null;
  }

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    image: account.image,
    role: account.role.name,
    status: account.status,
  };
});

export async function requireActor(): Promise<RbacActor> {
  const actor = await getActiveActor();
  if (!actor) throw new AuthorizationError("Authentication required.");
  return actor;
}

export async function requirePermission(permission: Permission): Promise<RbacActor> {
  const actor = await requireActor();
  if (!hasPermission(actor.role, permission)) throw new AuthorizationError();
  return actor;
}

export function assertPermission(actor: Pick<RbacActor, "role">, permission: Permission): void {
  if (!hasPermission(actor.role, permission)) throw new AuthorizationError();
}

export function assertOwnerOrPermission(
  actor: Pick<RbacActor, "id" | "role">,
  ownerId: string,
  manageAnyPermission: Permission,
): void {
  if (actor.id !== ownerId && !hasPermission(actor.role, manageAnyPermission)) {
    throw new AuthorizationError("You can only manage your own data.");
  }
}
