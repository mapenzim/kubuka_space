"use server";

import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { revalidatePath } from "next/cache";
import { chatGateway } from "@/lib/container/runtime";
import { requireAdmin } from "@/lib/admin/require_admin";

export async function getMerchandiseForAdmin() {
  await requireAdmin();
  const products = await prisma.merchandise.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    stockQuantity: product.stockQuantity,
    deletedAt: product.deletedAt?.toISOString() ?? null,
  }));
}

export async function createMerchandise(input: {
  title: string;
  body: string;
  price: number;
  stockQuantity?: number;
  categoryId?: string;
}) {
  await requireAdmin();
  const title = input.title.trim();
  const body = input.body.trim();

  if (!title || !body || !Number.isFinite(input.price) || input.price < 0) {
    throw new Error("Title, description, and a valid price are required.");
  }

  const product = await prisma.merchandise.create({
    data: {
      id: ulidId(),
      title,
      body,
      price: input.price,
      stockQuantity: input.stockQuantity ?? 0,
      categoryId: input.categoryId || null,
    },
    include: { category: true },
  });

  revalidatePath("/store");
  return { ...product, price: Number(product.price) };
}

export async function updateMerchandise(input: {
  id: string;
  title: string;
  body: string;
  price: number;
  stockQuantity?: number;
  categoryId?: string;
}) {
  await requireAdmin();
  const title = input.title.trim();
  const body = input.body.trim();

  if (!title || !body || !Number.isFinite(input.price) || input.price < 0) {
    throw new Error("Title, description, and a valid price are required.");
  }

  const product = await prisma.merchandise.update({
    where: { id: input.id },
    data: {
      title,
      body,
      price: input.price,
      ...(input.stockQuantity === undefined ? {} : { stockQuantity: input.stockQuantity }),
      categoryId: input.categoryId || null,
    },
    include: { category: true },
  });

  revalidatePath("/store");
  return { ...product, price: Number(product.price) };
}

export async function getProductCategories() {
  await requireAdmin();
  return prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });
}

export async function createProductCategory(input: { name: string; description?: string; parentId?: string }) {
  await requireAdmin();
  const name = input.name.trim();
  if (!name) throw new Error("Category name is required.");
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) throw new Error("Category name must contain letters or numbers.");
  return prisma.productCategory.create({ data: { id: ulidId(), name, slug, description: input.description?.trim() || null, parentId: input.parentId || null } });
}

export async function setMerchandiseDeleted(id: string, deleted: boolean) {
  await requireAdmin();
  const product = await prisma.merchandise.update({
    where: { id },
    data: { deletedAt: deleted ? new Date() : null },
  });

  revalidatePath("/store");
  return { ...product, price: Number(product.price) };
}

export async function getOrdersForAdmin() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { title: true, quantity: true, price: true } },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    customer: order.user.name ?? "Customer",
    email: order.user.email,
    items: order.items.map((item) => `${item.quantity}x ${item.title}`).join(", "),
    itemDetails: order.items.map((item) => ({ title: item.title, quantity: item.quantity, price: Number(item.price) })),
    total: Number(order.totalAmount),
    date: order.createdAt.toISOString(),
    status: order.status,
  }));
}

export async function getAdminStoreData() {
  await requireAdmin();
  const [products, categories, orders] = await Promise.all([
    getMerchandiseForAdmin(),
    getProductCategories(),
    getOrdersForAdmin(),
  ]);

  return { products, categories, orders };
}

export async function cancelOrder(orderId: string) {
  await requireAdmin();
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { status: true, items: { select: { merchandiseId: true, quantity: true } } },
    });
    if (!order) throw new Error("Order not found.");
    if (order.status === "delivered" || order.status === "cancelled") throw new Error("This order cannot be cancelled.");

    // Claim cancellation before restoring stock, preventing duplicate stock
    // restoration when two admin requests arrive at the same time.
    const claimed = await tx.order.updateMany({
      where: { id: orderId, status: order.status },
      data: { status: "cancelled" },
    });
    if (claimed.count !== 1) throw new Error("This order has already changed state.");

    for (const item of order.items) {
      await tx.merchandise.update({
        where: { id: item.merchandiseId },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }
  });
  revalidatePath("/admin/store");
  revalidatePath("/store");
}

export async function getOrderDetails(orderId: string) {
  await requireAdmin();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { name: true, email: true } }, items: true, shippingAddress: true, payments: true },
  });
  if (!order) throw new Error("Order not found.");
  return {
    id: order.id, status: order.status, paymentStatus: order.paymentStatus,
    customer: order.user.name ?? "Customer", email: order.user.email,
    total: Number(order.totalAmount), currency: order.currency, createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({ title: item.title, quantity: item.quantity, price: Number(item.price) })),
  };
}

export async function messageOrderCustomer(orderId: string, content: string) {
  await requireAdmin();
  const text = content.trim();
  if (!text || text.length > 5000) throw new Error("Message must contain between 1 and 5000 characters.");
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
  if (!order) throw new Error("Order not found.");
  const thread = await prisma.thread.findFirst({ where: { email: { equals: order.user.email, mode: "insensitive" } }, orderBy: { updatedAt: "desc" } });
  if (thread) {
    await chatGateway.sendMessage(thread.id, "admin", text);
  } else {
    await chatGateway.startConversation(order.user.name ?? "Customer", order.user.email, text, `order:${order.id}`, "admin");
  }
  revalidatePath("/admin/store");
}
