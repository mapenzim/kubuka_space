import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getBroadcaster } from "@/lib/broadcaster";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role ?? undefined },
  });

  const b = getBroadcaster();
  b.publish({
    type: "user", payload: user,
    channel: ""
  });

  return new Response(JSON.stringify(user), { status: 201 });
}

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return new Response(JSON.stringify(users));
}
