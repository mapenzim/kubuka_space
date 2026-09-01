"use server";

import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { hash } from "bcryptjs";
import { auth } from "@/auth";

type CreateUserResult =
  | { success: true }
  | { error: { message: string } };

export async function createUser(form: FormData): Promise<CreateUserResult> {
  const name = form.get("name") as string;
  const email = String(form.get("email") ?? "").trim().toLowerCase();
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
      data: {
        id: ulidId(),
        name,
        email,
        password: hashed,
        role: { connect: { name: "USER" } },
        settings: {
          create: {
            id: ulidId(),
          },
        },
      },
    });

    return { success: true };
  } catch (err: unknown) {
    return {
      error: {
        message: err instanceof Error ? err.message : "Failed to create user",
      },
    };
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
  } catch (err: unknown) {
    return {
      error: {
        message: err instanceof Error ? err.message : "Failed to reset password",
      },
    };
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
    // Password persistence will be added with token lookup.
    return { success: true };
  } catch (err: unknown) {
    return {
      error: {
        message: err instanceof Error ? err.message : "Failed to change password",
      },
    };
  }
}

type BioSubmitResult =
  | {
      success: true;
      bio: {
        id: string;
        text: string;
        userId: string;
      };
    }
  | { error: { message: string } };

export async function userBio(form: FormData): Promise<BioSubmitResult> {
  const session = await auth();
  const userId = session?.user?.id;
  const text = String(form.get("bio") ?? "").trim();

  if (!userId || session.user.status !== "ACTIVE") {
    return { error: { message: "Please sign in before updating your bio." } };
  }

  if (!text) {
    return { error: { message: "Your bio cannot be blank." } };
  }

  try {
    const bio = await prisma.bio.upsert({
      where: { userId },
      update: { text },
      create: {
        id: ulidId(),
        text,
        userId,
      },
    });

    return { success: true, bio };
  } catch {
    return { error: { message: "Unable to save your bio right now." } };
  }
}

export async function getUserBio(userId: string) {

  return prisma.bio.findFirst({
    where: { userId: userId },
  });
}

type WorkExperienceSubmitResult =
  | {
      success: true;
      experience: {
        id: string;
        jobTitle: string;
        companyName: string;
        dates: string;
        duties: string;
        userId: string;
      };
    }
  | { error: { message: string } };

export async function userWorkExperience(form: FormData): Promise<WorkExperienceSubmitResult> {
  const session = await auth();
  const userId = session?.user?.id;
  const experienceId = String(form.get("experienceId") ?? "").trim();
  const jobTitle = String(form.get("jobTitle") ?? "").trim();
  const companyName = String(form.get("companyName") ?? "").trim();
  const dates = String(form.get("dates") ?? "").trim();
  const duties = String(form.get("duties") ?? "").trim();

  if (!userId || session.user.status !== "ACTIVE") {
    return { error: { message: "Please sign in before adding work experience." } };
  }

  if (!jobTitle || !companyName || !dates || !duties) {
    return { error: { message: "Complete all work experience fields." } };
  }

  try {
    if (experienceId) {
      const existing = await prisma.workExperience.findFirst({
        where: { id: experienceId, userId },
        select: { id: true },
      });

      if (!existing) {
        return { error: { message: "Work experience not found." } };
      }

      const experience = await prisma.workExperience.update({
        where: { id: experienceId },
        data: { jobTitle, companyName, dates, duties },
      });

      return { success: true, experience };
    }

    const experience = await prisma.workExperience.upsert({
      where: {
        userId_jobTitle_companyName: { userId, jobTitle, companyName },
      },
      update: { dates, duties },
      create: {
        id: ulidId(),
        userId,
        jobTitle,
        companyName,
        dates,
        duties,
      },
    });

    return { success: true, experience };
  } catch {
    return { error: { message: "Unable to save work experience right now." } };
  }
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

export async function deleteUserWorkExperience(expId: string): Promise<
  { success: true } | { error: { message: string } }
> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user.status !== "ACTIVE") {
    return { error: { message: "Please sign in before deleting work experience." } };
  }

  const result = await prisma.workExperience.deleteMany({
    where: { id: expId, userId },
  });

  if (result.count === 0) {
    return { error: { message: "Work experience not found." } };
  }

  return { success: true };
}

type SkillSubmitResult =
  | {
      success: true;
      skill: {
        id: string;
        text: string;
        userId: string;
      };
    }
  | { error: { message: string } };

export async function userSkillAction(formData: FormData): Promise<SkillSubmitResult> {
  const session = await auth();
  const userId = session?.user?.id;
  const text = String(formData.get("text") ?? "").trim();

  if (!userId || session.user.status !== "ACTIVE") {
    return { error: { message: "Please sign in before adding a skill." } };
  }

  if (!text) {
    return { error: { message: "Text should not be blank." } };
  }
  
  try {
    const skill = await prisma.skill.upsert({
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
    return { success: true, skill };

  } catch (error: unknown) {
    return {
      error: {
        message: error instanceof Error ? error.message : "Failed to save data.",
      },
    };
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
