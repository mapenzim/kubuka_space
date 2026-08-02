"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { serializeDecimal } from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { Prisma, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

async function getOrCreateCart(tx: Prisma.TransactionClient | PrismaClient, userId: string, cartId?: string) {
  // 1. Try to find by cartId first (if provided)
  if (cartId) {
    let cart = await tx.cart.findFirst({
      where: { id: cartId, userId },
    });
    if (cart) return cart;

    const existingCart = await tx.cart.findUnique({
      where: { id: cartId },
    });
    if (existingCart) {
      throw new Error("Cart does not belong to this user.");
    }

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
  const session = await auth();
  const authenticatedUserId = session?.user?.id;

  if (!authenticatedUserId) {
    return { error: { message: "Sign in to add items to a server cart." } };
  }

  if (userId !== authenticatedUserId) {
    return { error: { message: "Invalid cart owner." } };
  }

  if (!items || items.length === 0) return { error: { message: "No items provided" } };

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: authenticatedUserId },
        select: { id: true },
      });

      if (!user) {
        throw new Error("Your account could not be found. Please sign in again.");
      }

      const cart = await getOrCreateCart(tx, user.id, cartId);

      for (const item of items) {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new Error("Invalid quantity.");
        }

        const merchandise = await tx.merchandise.findFirst({
          where: { id: item.merchandiseId, deletedAt: null },
        });

        if (!merchandise) throw new Error("Product is unavailable.");

        const existing = await tx.cartItem.findUnique({
          where: {
            cartId_merchandiseId: {
              cartId: cart.id,
              merchandiseId: item.merchandiseId,
            },
          },
        });

        if ((existing?.quantity ?? 0) + item.quantity > merchandise.stockQuantity) {
          throw new Error(`Only ${merchandise.stockQuantity} item(s) available.`);
        }

        await tx.cartItem.upsert({
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
          });
      }
    });

    return { success: true };
  } catch (err: any) {
    console.error("batchAddToCartAction error:", err);
    return { error: { message: err.message } };
  }
}

export async function getCartMeta() {
  const session = await auth();
  const userId = session?.user?.id;
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

export async function getCurrentUserCart() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          merchandise: {
            select: { id: true, title: true, body: true, price: true },
          },
        },
      },
    },
  });

  return cart ? serializeDecimal(cart) : null;
}

export async function getCartById(cartId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.cart.findMany({
    where: {
      id: cartId,
      userId: session.user.id,
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
  const session = await auth();
  if (!session?.user?.id || !Number.isInteger(quantity) || quantity < 1) return;

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId: session.user.id } },
    include: { merchandise: true },
  });
  if (!item || item.merchandise.deletedAt || quantity > item.merchandise.stockQuantity) {
    return { error: "Quantity exceeds available stock." };
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return { success: true };
}

export async function deleteCartItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const deleted = await prisma.cartItem.deleteMany({
      where: { id: itemId, cart: { userId: session.user.id } },
    });
    if (deleted.count !== 1) return { error: "Cart item not found" };
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
  const requestedCartId = String(formData.get("cartId") ?? "");

  const fullName = String(formData.get("fullName") ?? "").trim();
  const street = String(formData.get("street") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  if (!requestedCartId || !fullName || !street || !city || !country) {
    throw new Error("Complete all checkout fields.");
  }

  return await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: { merchandise: true },
        },
      },
    });

    if (!cart || cart.id !== requestedCartId) {
      throw new Error("Cart not found.");
    }

    if (cart.cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    if (cart.cartItems.some((item) => item.merchandise.deletedAt)) {
      throw new Error("One or more products are no longer available.");
    }

    for (const item of cart.cartItems) {
      const updated = await tx.merchandise.updateMany({
        where: {
          id: item.merchandiseId,
          deletedAt: null,
          stockQuantity: { gte: item.quantity },
        },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      if (updated.count !== 1) {
        throw new Error(`Insufficient stock for ${item.merchandise.title}.`);
      }
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
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true
    }
  });
}
