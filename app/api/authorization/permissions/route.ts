import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const roleName = session?.user?.role;
  if (!roleName || session.user.status !== "ACTIVE") {
    return NextResponse.json({ paths: [] }, { status: 401 });
  }
  const role = await prisma.role.findUnique({ where: { name: roleName }, include: { permissions: true } });
  return NextResponse.json({ paths: role?.permissions.map((permission) => permission.path) ?? [] });
}
