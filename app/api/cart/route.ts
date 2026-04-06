import { NextResponse } from "next/server";
import { getCartCount, getUserCart } from "@/app/actions/cartActions.server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const count = await getCartCount(userId);
  const cart = await getUserCart(userId);

  return NextResponse.json({ count, cartId: cart?.id ?? null });
}