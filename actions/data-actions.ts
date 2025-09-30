"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { Role } from "~/lib/generated/prisma/client";
import prisma from "~/lib/prisma";

interface RegisterResult {
  success: boolean;
  error: string;
  user: { id: number | null; email: string; role: Role };
}

const registerUser = async (
  prevState: { error?: string } | undefined,
  formData: FormData
): Promise<RegisterResult> => {
  const name = formData?.get('name') as string;
  const email = formData?.get('email') as string;
  const password = formData?.get('password') as string;

  if (!email || !password) {
    return { error: "Email and password required." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) { return { error: "User already exists" }; }

  const hashedPwd = await hash(password, 10);

  await prisma.user.create({
    data: {
      name: name ?? undefined,
      email: email,
      password: hashedPwd,
    }
  });

  redirect(`/authentication?callbackUrl=/`)

}

const allUsers = async () => {
  try {
    const users = await prisma.account.findMany();
    return { users };
  } catch (error) {
    return { error };
  }
}

const superUser = async () => {
  try {
    const userCount = await prisma.user.count();

    if (userCount > 0) return;

    const hashedPwd = await hash('kubuka_space', 10);

    await prisma.user.create({
      data: {
        email: "superuser@kubukaspace.com",
        password: hashedPwd,
        name: "Kubukaspace Superuser",
        role: Role.SUPERUSER
      }
    });

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Export functions
 */
export {
  allUsers,
  superUser,
  registerUser
}
