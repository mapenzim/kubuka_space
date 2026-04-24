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

  // Honeypot
  if (form.get("company")) {
    return { error: { message: "Spam detected." } };
  }

  // CAPTCHA verify
  const captchaToken = form.get("captchaToken");

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY_SIGNUP_FORM!,
        response: String(captchaToken),
      }),
    }
  );

  const data = await verifyRes.json();

  if (!data.success) {
    return { error: { message: "Captcha failed." } };
  }

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

type UpdateUser = 
  | { success: true }
  | { error: { message: string } };

export async function userBio(form: FormData): Promise<UpdateUser> {
  const userId = form.get("userId") as string;
  const bio = form.get("bio") as string;
  const bioId = form.get("bioId") as string;

  if (!bioId) {
    await prisma.bio.create({
      data: {
        id: ulidId(),
        text: bio,
        userId: userId
      }
    });

    revalidatePath("/profile");

    return { success: true };
  };

  await prisma.bio.update({
    where: { userId: bioId },
    data: { text: bio }
  });

  return { success: true }
}

export async function getUserBio(userId: string) {

  return prisma.bio.findFirst({
    where: { userId: userId },
  });
}

export async function userWorkExperience(form: FormData): Promise<UpdateUser> {
  const userId = form.get("userId") as string;
  const jobTitle = form.get("jobTitle") as string;
  const companyName = form.get("companyName") as string;
  const dates = form.get("dates") as string;
  const duties = form.get("duties") as string;;

  await prisma.workExperience.upsert({
    where: {
      userId_jobTitle_companyName: {
        userId,
        jobTitle,
        companyName,
      },
    },
    update: {
      dates,
      duties,
    },
    create: {
      id: ulidId(),
      userId,
      jobTitle,
      companyName,
      dates,
      duties,
    },
  });

  revalidatePath("/profile");

  return { success: true }
}

export async function getUserExperience(id: string) {
  return prisma.workExperience.findFirst({
    where: { 
      id
    }
  });
}

export async function getUserAllExperience(userId: string) {
  return prisma.workExperience.findMany({
    where: { userId }
  });
}

export async function deleteUserWorkExperience(expId: string) {
  return prisma.workExperience.delete({
    where: { id: expId }
  });
}

type SubmitResult =
  | { success: true }
  | { error: { message: string } };

export async function userSkillAction(formData: FormData): Promise<SubmitResult> {
  const text = formData.get("text") as string;
  const userId = formData.get("userId") as string;

  if (!text) {
    return { error: { message: "Text should not be blank." } };
  }
  
  try {
    await prisma.skill.upsert({
      where: {
        text_userId: {
          text, 
          userId
        }
      },
      update: {},
      create: {
        id: ulidId(),
        text,
        userId
      }
    });
    return { success: true }

  } catch (error: any) {
    return { error: { message: error.message || "Failed to save data." } };
  }
}

export async function getUserSkills(userId: string) {
  return prisma.skill.findMany({
    where: {
      userId
    }
  });
}

export async function deleteUserSkill(id: string) {
  return prisma.skill.delete({
    where: {
      id
    }
  });
}