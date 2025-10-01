"use server";

import { hash } from "bcryptjs";
import prisma from "~/lib/prisma";

interface RegisterState {
  success: boolean;
  error?: string;
}

export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const name = formData.get("name") as string | null;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "User already exists." };
  }

  const hashed = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: name ?? undefined,
    },
  });

  return { success: true };
}
