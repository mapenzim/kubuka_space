import { NextResponse } from "next/server";
import { getActiveActor } from "@/lib/rbac/server";
import { permissionsForRole } from "@/lib/rbac/policy";

export async function GET() {
  const actor = await getActiveActor();
  if (!actor) return NextResponse.json({ permissions: [] }, { status: 401 });
  return NextResponse.json({ permissions: permissionsForRole(actor.role) });
}
