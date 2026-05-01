"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

type AddToCartResult =
  | { success: true }
  | { error: { message: string } };

async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        id: ulidId(),
        userId,
      },
    });
  }

  return cart;
}

export async function addToCartAction(
  userId: string,
  items: { id: string; quantity: number }[],
  itemToAdd?: string
): Promise<AddToCartResult> {
  if (!userId) return { error: { message: "User ID is required" } };

  try {
    await prisma.$transaction(async (tx) => {
      const cart = await getOrCreateCart(userId);

      const allItems = [
        ...items,
        ...(itemToAdd ? [{ id: itemToAdd, quantity: 1 }] : []),
      ];

      if (allItems.length === 0) {
        throw new Error("No items to add");
      }

      for (const item of allItems) {
        const existing = await tx.cartItem.findUnique({
          where: {
            cartId_merchandiseId: {
              cartId: cart.id,
              merchandiseId: item.id,
            },
          },
        });

        if (existing) {
          await tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: { increment: item.quantity } },
          });
        } else {
          await tx.cartItem.create({
            data: {
              id: ulidId(),
              cartId: cart.id,
              merchandiseId: item.id,
              quantity: item.quantity,
            },
          });
        }
      }
    });

    return { success: true };
  } catch (err: any) {
    return { error: { message: err.message } };
  }
}

export async function getCartCount(userId: string): Promise<number> {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { cartItems: true },
  });

  if (!cart) return 0;

  return cart.cartItems.reduce((sum, i) => sum + i.quantity, 0);
}

export async function getUserCart(userId: string) {
  return await prisma.cart.findFirst({
    where: { userId },
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
  console.log("Item To Be Deleted: ", itemId);
  
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

export async function commitCart(tempCart: CartItem[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const cart = await getOrCreateCart(session.user.id);

  for (const item of tempCart) {
    await prisma.cartItem.upsert({
      where: {
        cartId_merchandiseId: {
          cartId: cart.id,
          merchandiseId: item.id,
        },
      },
      update: {
        quantity: { increment: item.quantity },
      },
      create: {
        id: ulidId(),
        cartId: cart.id,
        merchandiseId: item.id,
        quantity: item.quantity,
      },
    });
  }

  return { success: true };
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
