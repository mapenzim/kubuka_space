"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { Prisma, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

async function getOrCreateCart(tx: Prisma.TransactionClient | PrismaClient, userId: string, cartId?: string) {
  // 1. Try to find by cartId first (if provided)
  if (cartId) {
    let cart = await tx.cart.findUnique({ where: { id: cartId } });
    if (cart) return cart;

    // If not found, create new cart with that ID
    cart = await tx.cart.create({
      data: {
        id: cartId,
        userId,
      },
    });
    return cart;
  }

  // 2. Otherwise, find by userId
  let cart = await tx.cart.findFirst({ where: { userId } });

  // 3. If none exists, create new with provided cartId or fresh ULID
  if (!cart) {
    cart = await tx.cart.create({
      data: {
        id: ulidId(),
        userId,
      },
    });
  }

  return cart;
}

type BatchAddInput = {
  userId: string;
  cartId?: string;
  items: { merchandiseId: string; quantity: number }[];
};

export async function batchAddToCartAction({
  userId,
  cartId,
  items,
}: BatchAddInput): Promise<{ success?: boolean; error?: { message: string } }> {
  
  if (!userId) return { error: { message: "User ID is required" } };
  if (!items || items.length === 0) return { error: { message: "No items provided" } };

  try {
    await prisma.$transaction(async (tx) => {
      const cart = await getOrCreateCart(tx, userId, cartId);

      await Promise.all(
        items.map((item) =>
          tx.cartItem.upsert({
            where: {
              cartId_merchandiseId: {
                cartId: cart.id,
                merchandiseId: item.merchandiseId,
              },
            },
            update: {
              quantity: { increment: item.quantity },
            },
            create: {
              id: ulidId(),
              cartId: cart.id,
              merchandiseId: item.merchandiseId,
              quantity: item.quantity,
            },
          })
        )
      );
    });

    return { success: true };
  } catch (err: any) {
    console.error("batchAddToCartAction error:", err);
    return { error: { message: err.message } };
  }
}

export async function getCartMeta(userId: string) {
  if (!userId) return { distinctCount: 0, totalCount: 0, cartId: null };

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      cartItems: true,
    },
  });

  if (!cart) return { distinctCount: 0, totalCount: 0, cartId: null };

  // distinct items = number of cartItems
  const distinctCount = cart.cartItems.length;

  // total units = sum of quantities
  const totalCount = cart.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return {
    distinctCount,
    totalCount,
    cartId: cart.id,
  };
}

export async function getCartById(cartId: string) {
  return await prisma.cart.findMany({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
        include: {
          merchandise: {
            select: {
              id: true,
              title: true,
              body: true,
              price: true
            }
          },
        },
      },
    },
  });
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  if (quantity < 1) return;

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return { success: true };
}

export async function deleteCartItem(itemId: string) {
  
  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    // trigger revalidation so UI updates
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete item" };
  }
}

export async function checkoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const fullName = formData.get("fullName") as string;
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;

  return await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: { merchandise: true },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // 🧮 Calculate total server-side (NEVER trust client)
    const total = cart.cartItems.reduce((sum, item) => {
      return sum + Number(item.merchandise.price) * item.quantity;
    }, 0);

    // 🧾 Create Order
    const order = await tx.order.create({
      data: {
        id: ulidId(),
        userId,
        totalAmount: total,
        status: "pending",
        paymentStatus: "PENDING",

        items: {
          create: cart.cartItems.map((item) => ({
            id: ulidId(),
            merchandiseId: item.merchandiseId,
            title: item.merchandise.title,
            price: item.merchandise.price,
            quantity: item.quantity,
          })),
        },

        shippingAddress: {
          create: {
            id: ulidId(),
            fullName,
            street,
            city,
            country,
          },
        },

        payments: {
          create: {
            id: ulidId(),
            amount: total,
            method: "ECOCASH",
            status: "PENDING",
          },
        },
      },
    });

    // 🧹 Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true, orderId: order.id };
  });
}

interface CartItem {
  id: string;
  quantity: number;
}

export async function getAllOrdersByUser(userId: string) {
  return await prisma.order.findMany({
    where: {
      userId
    },
    include: {
      items: true
    }
  });
}
