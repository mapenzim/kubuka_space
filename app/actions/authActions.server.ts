"use server";

import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

type CreateUserResult =
  | { success: true }
  | { error: { message: string } };

export async function createUser(form: FormData): Promise<CreateUserResult> {
  const name = form.get("name") as string;
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const confirm = form.get("confirmPassword") as string;

  if (!name || !email || !password || !confirm) {
    return { error: { message: "All fields are required" } };
  }

  if (password !== confirm) {
    return { error: { message: "Passwords do not match" } };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: { message: "User already exists" } };
    }

    const hashed = await hash(password, 10);
    await prisma.user.create({
      data: { id: ulidId(), name, email, password: hashed },
    });

    return { success: true };
  } catch (err: any) {
    return { error: { message: err.message || "Failed to create user" } };
  }
}

type ResetPasswordResult =
  | { success: true; token: string }
  | { error: { message: string } };

export async function resetPasswordAction(email: string): Promise<ResetPasswordResult> {
  if (!email) return { error: { message: "Email is required" } };

  try {
    // TODO: Implement your real password reset logic (send email, generate token)
    const token = Math.random().toString(36).substring(2, 15); // example token
    return { success: true, token };
  } catch (err: any) {
    return { error: { message: err.message || "Failed to reset password" } };
  }
}

type ChangePasswordResult =
  | { success: true }
  | { error: { message: string } };

export async function changePasswordAction(token: string | null, newPassword: string): Promise<ChangePasswordResult> {
  if (!token) return { error: { message: "Invalid token" } };
  if (!newPassword) return { error: { message: "Password is required" } };

  try {
    // TODO: Lookup user by token and update password
    const hashed = await hash(newPassword, 10);
    // await prisma.user.update({ where: { token }, data: { password: hashed } });
    return { success: true };
  } catch (err: any) {
    return { error: { message: err.message || "Failed to change password" } };
  }
}
