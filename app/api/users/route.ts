import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getBroadcaster } from "@/lib/broadcaster";
import { ulidId } from "@/lib/server-utils";
import { canAssignRole, PERMISSIONS } from "@/lib/rbac/policy";
import { requirePermission } from "@/lib/rbac/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const actor = await requirePermission(PERMISSIONS.USERS_CREATE);
    const { name, email, password, role = "USER" } = await req.json();
    const normalizedEmail = String(email ?? "").trim().toLowerCase();

    if (!name || !normalizedEmail || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Valid name, email, and password are required." }, { status: 400 });
    }
    if (!canAssignRole(actor.role, role)) {
      return NextResponse.json({ error: "You cannot assign that role." }, { status: 403 });
    }

    const selectedRole = await prisma.role.findUnique({
      where: { name: role },
      select: { id: true },
    });
    if (!selectedRole) {
      return NextResponse.json({ error: "Role not found." }, { status: 400 });
    }

    const hashed = await hash(password, 10);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          id: ulidId(),
          name: String(name).trim(),
          email: normalizedEmail,
          password: hashed,
          roleId: selectedRole.id,
        },
        select: { id: true, name: true, email: true, status: true, createdAt: true },
      });
      await tx.settings.create({ data: { id: ulidId(), userId: created.id } });
      return created;
    });

  const b = getBroadcaster();
  b.publish({
    type: "user", payload: user,
    channel: ""
  });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create user." }, { status: 403 });
  }
}

export async function GET() {
  try {
    await requirePermission(PERMISSIONS.USERS_READ);
    const users = await prisma.user.findMany({
      where: { NOT: { role: { is: { name: "SUPERUSER" } } } },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
        role: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
}
