"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { ulidId } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AdminRole, requireAdmin } from "@/lib/admin/require_admin";

type ManageableRole = "USER" | "EDITOR" | "ADMIN";
type ManagedUserStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

type AdminActionResult =
  | { success: true }
  | { success: false; error: string };

function refreshUserManagement() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

function roleFromForm(value: FormDataEntryValue | null): ManageableRole | null {
  const role = String(value ?? "").toUpperCase();
  return role === "USER" || role === "EDITOR" || role === "ADMIN"
    ? role
    : null;
}

function actionError(error: unknown, fallback: string): AdminActionResult {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return { success: false, error: "A user with this email already exists." };
  }

  console.error(fallback, error);
  return {
    success: false,
    error: error instanceof Error ? error.message : fallback,
  };
}

async function getManagedTarget(userId: string) {
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      status: true,
      role: { select: { name: true } },
    },
  });

  if (!target) {
    throw new Error("User not found.");
  }

  if (target.role?.name === "SUPERUSER") {
    throw new Error("The superuser account cannot be managed here.");
  }

  return target;
}

function assertCanManageTarget(
  actor: { id: string; role: AdminRole },
  target: Awaited<ReturnType<typeof getManagedTarget>>,
  options: { destructive?: boolean } = {},
) {
  if (options.destructive && actor.id === target.id) {
    throw new Error("You cannot suspend, archive, or delete your own account.");
  }

  if (
    actor.role !== "SUPERUSER" &&
    target.role?.name === "ADMIN" &&
    target.id !== actor.id
  ) {
    throw new Error("Only the superuser can manage another administrator.");
  }
}

export async function createUser(
  formData: FormData,
): Promise<AdminActionResult> {
  try {
    const actor = await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const roleName = roleFromForm(formData.get("role"));

    if (!name || !email || !password || !roleName) {
      return { success: false, error: "Complete all required fields." };
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return { success: false, error: "Enter a valid email address." };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "The temporary password must contain at least 8 characters.",
      };
    }

    if (roleName === "ADMIN" && actor.role !== "SUPERUSER") {
      return {
        success: false,
        error: "Only the superuser can create an administrator.",
      };
    }

    const role = await prisma.role.findUnique({
      where: { name: roleName },
      select: { id: true },
    });

    if (!role) {
      return { success: false, error: "The selected role is unavailable." };
    }

    const passwordHash = await hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: ulidId(),
          name,
          email,
          password: passwordHash,
          roleId: role.id,
          status: "ACTIVE",
        },
        select: { id: true },
      });

      await tx.settings.create({
        data: {
          id: ulidId(),
          userId: user.id,
        },
      });

      await tx.log.create({
        data: {
          id: ulidId(),
          userId: actor.id,
          action: "USER_CREATED",
          details: { targetUserId: user.id, role: roleName },
        },
      });
    });

    refreshUserManagement();
    return { success: true };
  } catch (error) {
    return actionError(error, "Failed to create user.");
  }
}

export async function updateManagedUser(
  formData: FormData,
): Promise<AdminActionResult> {
  try {
    const actor = await requireAdmin();
    const userId = String(formData.get("userId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const submittedEmail = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const roleName = roleFromForm(formData.get("role"));

    if (!userId || !name || !roleName) {
      return { success: false, error: "Complete all required fields." };
    }

    const target = await getManagedTarget(userId);
    assertCanManageTarget(actor, target);

    if (submittedEmail && submittedEmail !== target.email.toLowerCase()) {
      return {
        success: false,
        error: "A user's email address cannot be changed.",
      };
    }

    const currentRole = (target.role?.name ?? "USER") as ManageableRole;

    if (actor.id === target.id && roleName !== currentRole) {
      return { success: false, error: "You cannot change your own role." };
    }

    if (
      (roleName === "ADMIN" || currentRole === "ADMIN") &&
      actor.role !== "SUPERUSER" &&
      actor.id !== target.id
    ) {
      return {
        success: false,
        error: "Only the superuser can manage administrator roles.",
      };
    }

    if (password && password.length < 8) {
      return {
        success: false,
        error: "A new password must contain at least 8 characters.",
      };
    }

    const role = await prisma.role.findUnique({
      where: { name: roleName },
      select: { id: true },
    });

    if (!role) {
      return { success: false, error: "The selected role is unavailable." };
    }

    const passwordHash = password ? await hash(password, 10) : undefined;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: target.id },
        data: {
          name,
          roleId: role.id,
          ...(passwordHash ? { password: passwordHash } : {}),
        },
      });

      await tx.log.create({
        data: {
          id: ulidId(),
          userId: actor.id,
          action: "USER_UPDATED",
          details: {
            targetUserId: target.id,
            previousRole: currentRole,
            role: roleName,
          },
        },
      });
    });

    refreshUserManagement();
    return { success: true };
  } catch (error) {
    return actionError(error, "Failed to update user.");
  }
}

export async function setManagedUserStatus(
  userId: string,
  status: ManagedUserStatus,
): Promise<AdminActionResult> {
  try {
    const actor = await requireAdmin();
    const target = await getManagedTarget(userId);
    assertCanManageTarget(actor, target, { destructive: true });

    if (!["ACTIVE", "SUSPENDED", "ARCHIVED"].includes(status)) {
      return { success: false, error: "Invalid account status." };
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: target.id },
        data: {
          status,
          suspendedAt: status === "SUSPENDED" ? now : null,
          archivedAt: status === "ARCHIVED" ? now : null,
        },
      });

      await tx.log.create({
        data: {
          id: ulidId(),
          userId: actor.id,
          action: `USER_${status}`,
          details: {
            targetUserId: target.id,
            previousStatus: target.status,
          },
        },
      });
    });

    refreshUserManagement();
    return { success: true };
  } catch (error) {
    return actionError(error, "Failed to update account status.");
  }
}

export async function deleteManagedUser(
  userId: string,
): Promise<AdminActionResult> {
  try {
    const actor = await requireAdmin();
    const target = await getManagedTarget(userId);
    assertCanManageTarget(actor, target, { destructive: true });

    await prisma.$transaction(async (tx) => {
      await tx.user.delete({ where: { id: target.id } });
      await tx.log.create({
        data: {
          id: ulidId(),
          userId: actor.id,
          action: "USER_DELETED",
          details: { targetUserId: target.id, email: target.email },
        },
      });
    });

    refreshUserManagement();
    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        error:
          "This user has related records and cannot be permanently deleted. Archive the account instead.",
      };
    }

    return actionError(error, "Failed to delete user.");
  }
}

export async function getAllUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: {
      NOT: {
        role: {
          is: {
            name: "SUPERUSER",
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      status: true,
      suspendedAt: true,
      archivedAt: true,
      role: { select: { name: true } },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
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
    prisma.user.count({
      where: {
        status: { not: "ARCHIVED" },
        NOT: {
          role: {
            is: {
              name: "SUPERUSER",
            },
          },
        },
      },
    }),
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
