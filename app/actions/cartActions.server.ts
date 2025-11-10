"use server";

import prisma from "@/lib/prisma";

type AddToCartResult =
  | { success: true }
  | { error: { message: string } };

export async function addToCartAction(itemId: number, userId: string): Promise<AddToCartResult> {
  try {
    // Check if the item exists
    const item = await prisma.merchandise.findUnique({ where: { id: Number(itemId) } });
    if (!item) return { error: { message: "Item not found" } };

    // Add to cart (example: assume a Cart model exists)
    await prisma.cart.create({
      data: {
        userId: Number(userId),
        merchandiseId: item.id,
        quantity: 1,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { error: { message: err.message || "Failed to add to cart" } };
  }
}

export async function getCartCount(userId: number): Promise<number> {
  const count = await prisma.cart.count({
    where: { userId },
  });
  return count;
}
