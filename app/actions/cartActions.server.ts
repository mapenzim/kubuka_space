"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { serializeDecimal } from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { Prisma, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getDiscountedUnitPrice } from "@/lib/pricing";
import { chatGateway } from "@/lib/container/runtime";
import { humanizeSnippetValue } from "@/lib/snippets";

async function getOrCreateCart(tx: Prisma.TransactionClient | PrismaClient, userId: string, cartId?: string) {
  if (cartId) {
    const requestedCart = await tx.cart.findUnique({
      where: { id: cartId },
    });
    if (requestedCart?.userId === userId) return requestedCart;
    if (requestedCart) {
      throw new Error("Cart does not belong to this user.");
    }

    const userCart = await tx.cart.findUnique({ where: { userId } });
    if (userCart) return userCart;

    return tx.cart.create({
      data: {
        id: cartId,
        userId,
      },
    });
  }

  const cart = await tx.cart.findUnique({ where: { userId } });
  return cart ?? tx.cart.create({
      data: {
        id: ulidId(),
        userId,
      },
    });
}

async function getCartSnapshot(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          merchandise: {
            select: { id: true, title: true, body: true, price: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return cart ? serializeDecimal(cart) : null;
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
}: BatchAddInput) {
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
    const normalizedItems = Array.from(
      items.reduce((quantities, item) => {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
          throw new Error("Invalid quantity.");
        }
        quantities.set(
          item.merchandiseId,
          (quantities.get(item.merchandiseId) ?? 0) + item.quantity,
        );
        return quantities;
      }, new Map<string, number>()),
      ([merchandiseId, quantity]) => ({ merchandiseId, quantity }),
    );

    await prisma.$transaction(async (tx) => {
      const cart = await getOrCreateCart(tx, authenticatedUserId, cartId);
      const merchandiseIds = normalizedItems.map((item) => item.merchandiseId);

      const [products, existingItems] = await Promise.all([
        tx.merchandise.findMany({
          where: { id: { in: merchandiseIds }, deletedAt: null },
          select: { id: true, stockQuantity: true },
        }),
        tx.cartItem.findMany({
          where: { cartId: cart.id, merchandiseId: { in: merchandiseIds } },
          select: { merchandiseId: true, quantity: true },
        }),
      ]);

      const productsById = new Map(products.map((product) => [product.id, product]));
      const quantitiesById = new Map(
        existingItems.map((item) => [item.merchandiseId, item.quantity]),
      );

      for (const item of normalizedItems) {
        const product = productsById.get(item.merchandiseId);
        if (!product) throw new Error("Product is unavailable.");
        if ((quantitiesById.get(item.merchandiseId) ?? 0) + item.quantity > product.stockQuantity) {
          throw new Error(`Only ${product.stockQuantity} item(s) available.`);
        }
      }

      await Promise.all(normalizedItems.map((item) =>
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
          }),
      ));
    });

    return { success: true as const, cart: await getCartSnapshot(authenticatedUserId) };
  } catch (err: unknown) {
    console.error("batchAddToCartAction error:", err);
    return {
      error: {
        message: err instanceof Error ? err.message : "Unable to update cart.",
      },
    };
  }
}

export async function getCurrentUserCart() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  return getCartSnapshot(userId);
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
  } catch {
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

  const result = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            merchandise: {
              include: {
                snippetProduct: {
                  select: { language: true },
                },
              },
            },
          },
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
      return sum + getDiscountedUnitPrice(Number(item.merchandise.price)) * item.quantity;
    }, 0);

    // 🧾 Create Order
    const order = await tx.order.create({
      data: {
        id: ulidId(),
        userId,
        totalAmount: total,
        status: "paid",
        paymentStatus: "PAID",

        items: {
          create: cart.cartItems.map((item) => ({
            id: ulidId(),
            merchandiseId: item.merchandiseId,
            title: item.merchandise.title,
            price: getDiscountedUnitPrice(Number(item.merchandise.price)),
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
            method: "TEMPORARY_CHECKOUT",
            status: "PAID",
            paidAt: new Date(),
          },
        },
      },
    });

    // 🧹 Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    const snippetItems = cart.cartItems.flatMap((item) =>
      item.merchandise.snippetProduct
        ? [{
            title: item.merchandise.title,
            language: item.merchandise.snippetProduct.language,
            quantity: item.quantity,
          }]
        : [],
    );

    return { success: true, orderId: order.id, snippetItems };
  });

  if (result.snippetItems.length > 0 && session.user.email) {
    const totalCredits = result.snippetItems.reduce((sum, item) => sum + item.quantity, 0);
    const productSummary = result.snippetItems
      .map((item) => `${item.quantity}× ${item.title} (${humanizeSnippetValue(item.language)})`)
      .join(", ");
    const acknowledgement =
      `Your code snippet purchase is confirmed: ${productSummary}. ` +
      `${totalCredits} request credit${totalCredits === 1 ? " is" : "s are"} now available. ` +
      "Open this conversation and choose “Request purchased snippet” to send your requirements. " +
      "A developer will review the request and deliver the completed source files securely in this chat.";

    try {
      const existingThread = await prisma.thread.findFirst({
        where: {
          archived: false,
          email: { equals: session.user.email, mode: "insensitive" },
        },
        orderBy: { updatedAt: "desc" },
        select: { id: true },
      });

      if (existingThread) {
        await chatGateway.sendMessage(existingThread.id, "bot", acknowledgement);
      } else {
        await chatGateway.startConversation(
          session.user.name ?? fullName,
          session.user.email,
          acknowledgement,
          undefined,
          "bot",
        );
      }
    } catch (error) {
      // Checkout has already committed successfully. A transient chat failure
      // must not turn a paid order into a failed checkout response.
      console.error("Unable to send snippet purchase acknowledgement.", error);
    }
  }

  revalidatePath("/store");
  revalidatePath("/profile");
  revalidatePath("/admin/store");
  revalidatePath("/contact_us");

  return {
    success: result.success,
    orderId: result.orderId,
    snippetPurchase: result.snippetItems.length > 0,
  };
}

export async function getAllOrdersByUser(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) return [];

  return await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: true
    }
  });
}
