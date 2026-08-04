"use server";

import prisma from "@/lib/prisma";
import { getBroadcaster } from "@/lib/broadcaster";
import { hash } from "bcryptjs";
import { ulidId } from "@/lib/server-utils";
import { auth } from "@/auth";
import { isAdminRole } from "@/lib/roles";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("Administrator access required.");
  }
  return session;
}

export async function createUser(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashd = await hash(password, 10);

  const user = await prisma.user.create({
    data: { id: ulidId(), name, email, password: hashd },
  });

  const broadcaster = getBroadcaster();

  // Notify admins only
  broadcaster.publish({
    channel: "admin",
    type: "user:created",
    payload: user,
  });

  // Also notify the public feed (if needed)
  broadcaster.publish({
    channel: "public",
    type: "feed:update",
    payload: { message: `${user.name} just joined!` },
  });

  return user;
}

export async function getAllUsers() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
}

export async function getAdminDashboardData() {
  await requireAdmin();

  const [
    totalUsers,
    publishedPosts,
    activeOrders,
    paidRevenue,
    recentOrders,
    recentPosts,
    pendingOrders,
    draftPosts,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count({ where: { published: true, deletedAt: null } }),
    prisma.order.count({ where: { archived: false, status: { not: "cancelled" } } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { archived: false, status: { not: "cancelled" }, paymentStatus: "PAID" },
    }),
    prisma.order.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, published: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { archived: false, status: "pending" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.post.findMany({
      where: { published: false, deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true },
    }),
  ]);

  return {
    stats: {
      totalUsers,
      publishedPosts,
      activeOrders,
      paidRevenue: Number(paidRevenue._sum.totalAmount ?? 0),
    },
    recentActivity: [
      ...recentOrders.map((order) => ({
        id: `order-${order.id}`,
        label: `Order from ${order.user.name ?? order.user.email}`,
        detail: `${order.status} · $${Number(order.totalAmount).toFixed(2)}`,
        date: order.createdAt.toISOString(),
        href: "/admin/store",
      })),
      ...recentPosts.map((post) => ({
        id: `post-${post.id}`,
        label: post.title,
        detail: post.published ? "Published post" : "Draft post",
        date: post.createdAt.toISOString(),
        href: `/admin/posts/${post.id}/edit`,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6),
    pendingApprovals: [
      ...pendingOrders.map((order) => ({
        id: `order-${order.id}`,
        label: `Order from ${order.user.name ?? order.user.email}`,
        detail: `$${Number(order.totalAmount).toFixed(2)}`,
        date: order.createdAt.toISOString(),
        href: "/admin/store",
      })),
      ...draftPosts.map((post) => ({
        id: `post-${post.id}`,
        label: post.title,
        detail: "Draft post",
        date: post.updatedAt.toISOString(),
        href: `/admin/posts/${post.id}/edit`,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6),
  };
}
