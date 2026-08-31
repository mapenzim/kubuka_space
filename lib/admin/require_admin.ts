import "server-only";

import { cache } from "react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";

export type AdminRole = "ADMIN" | "SUPERUSER";

export const getActiveAdmin = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const actor = await prisma.user.findUnique({
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
    !actor ||
    actor.status !== "ACTIVE" ||
    !isAdminRole(actor.role?.name)
  ) {
    return null;
  }

  return {
    id: actor.id,
    name: actor.name,
    email: actor.email,
    image: actor.image,
    role: actor.role!.name as AdminRole,
  };
});

export async function requireAdmin() {
  const actor = await getActiveAdmin();
  if (!actor) throw new Error("Administrator access required.");
  return actor;
}
