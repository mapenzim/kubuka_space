"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import prisma from "~/lib/prisma";

interface RegisterResult {
  success: boolean;
  error?: string;
  user?: { id: number; email: string; role: Role | null };
}

/**
 * Server Action: Register a user
 */
export async function registerUser(
  prevState: RegisterResult,
  formData: FormData
): Promise<RegisterResult> {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password required.",
    };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "User already exists" };
  }

  const hashedPwd = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name ?? undefined,
      email,
      password: hashedPwd,
    },
  });

  // Option A: redirect and never return
  redirect(`/authentication?callbackUrl=/`);

  // Option B: if you prefer returning, comment redirect() and do:
  // return { success: true, user };
}

/**
 * Get all accounts
 */
export async function allUsers() {
  try {
    const users = await prisma.account.findMany();
    return { users };
  } catch (error) {
    return { error };
  }
}

/**
 * Ensure a superuser exists
 */
export async function superUser() {
  try {
    const userCount = await prisma.user.count();

    if (userCount > 0) return;

    const hashedPwd = await hash("kubuka_space", 10);

    await prisma.user.create({
      data: {
        email: "superuser@kubukaspace.com",
        password: hashedPwd,
        name: "Kubukaspace Superuser",
        role: Role.SUPERUSER,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
