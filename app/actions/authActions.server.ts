"use server";

import prisma from "@/lib/prisma";
import { ulidId } from "@/lib/server-utils";
import { hash } from "bcryptjs";
import { auth } from "@/auth";
import type { WorkExperience } from "@prisma/client";

type CreateUserResult =
  | { success: true }
  | { error: { message: string } };

export async function createUser(form: FormData): Promise<CreateUserResult> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirmPassword") ?? "");

  // Honeypot
  if (form.get("company")) {
    return { error: { message: "Spam detected." } };
  }

  if (!name || !email || !password || !confirm) {
    return { error: { message: "All fields are required" } };
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: { message: "Enter a valid email address." } };
  }

  if (password !== confirm) {
    return { error: { message: "Passwords do not match" } };
  }

  if (password.length < 8) {
    return { error: { message: "Password must contain at least 8 characters." } };
  }

  const captchaToken = String(form.get("captchaToken") ?? "");
  const captchaSecret = process.env.TURNSTILE_SECRET_KEY_SIGNUP_FORM;

  if (!captchaToken || !captchaSecret) {
    return { error: { message: "Captcha verification is unavailable." } };
  }

  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: captchaSecret,
          response: captchaToken,
        }),
        cache: "no-store",
      },
    );

    if (!verifyRes.ok) {
      return { error: { message: "Captcha verification failed." } };
    }

    const data = await verifyRes.json() as { success?: boolean };
    if (!data.success) {
      return { error: { message: "Captcha verification failed." } };
    }
  } catch {
    return { error: { message: "Captcha verification is temporarily unavailable." } };
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

type WorkExperienceDto = Omit<WorkExperience, "startDate" | "endDate"> & {
  startDate: string | null;
  endDate: string | null;
};

function toWorkExperienceDto(experience: WorkExperience): WorkExperienceDto {
  return {
    ...experience,
    startDate: experience.startDate?.toISOString() ?? null,
    endDate: experience.endDate?.toISOString() ?? null,
  };
}

function parseExperienceMonth(monthValue: string, yearValue: string): Date | null {
  let month = Number(monthValue.trim());
  let year = Number(yearValue.trim());

  // Accept the former YYYY-MM field shape from a page left open during deployment.
  if (!yearValue.trim()) {
    const legacyValue = /^(\d{4})-(\d{2})$/.exec(monthValue.trim());
    if (legacyValue) {
      year = Number(legacyValue[1]);
      month = Number(legacyValue[2]);
    }
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;

  return new Date(Date.UTC(year, month - 1, 1));
}

function formatExperienceMonth(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

type WorkExperienceSubmitResult =
  | {
      success: true;
      experience: WorkExperienceDto;
    }
  | { error: { message: string } };

export async function userWorkExperience(form: FormData): Promise<WorkExperienceSubmitResult> {
  const session = await auth();
  const userId = session?.user?.id;
  const experienceId = String(form.get("experienceId") ?? "").trim();
  const jobTitle = String(form.get("jobTitle") ?? "").trim();
  const companyName = String(form.get("companyName") ?? "").trim();
  const startDate = parseExperienceMonth(
    String(form.get("startMonth") ?? ""),
    String(form.get("startYear") ?? ""),
  );
  const isCurrent = ["true", "on"].includes(String(form.get("isCurrent") ?? ""));
  const endDate = isCurrent
    ? null
    : parseExperienceMonth(
        String(form.get("endMonth") ?? ""),
        String(form.get("endYear") ?? ""),
      );
  const duties = String(form.get("duties") ?? "").trim();

  if (!userId || session.user.status !== "ACTIVE") {
    return { error: { message: "Please sign in before adding work experience." } };
  }

  if (!jobTitle) return { error: { message: "Enter a job title." } };
  if (!companyName) return { error: { message: "Enter a company name." } };
  if (!startDate) return { error: { message: "Select the From month and year." } };
  if (!isCurrent && !endDate) {
    return { error: { message: "Select the To month and year, or choose Present." } };
  }
  if (!duties) return { error: { message: "Describe your duties." } };

  if (endDate && endDate < startDate) {
    return { error: { message: "The To date cannot be earlier than the From date." } };
  }

  const endLabel = isCurrent || !endDate
    ? "Present"
    : formatExperienceMonth(endDate);
  const dates = `${formatExperienceMonth(startDate)} – ${endLabel}`;

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
        data: {
          jobTitle,
          companyName,
          dates,
          startDate,
          endDate,
          isCurrent,
          duties,
        },
      });

      return { success: true, experience: toWorkExperienceDto(experience) };
    }

    const experience = await prisma.workExperience.upsert({
      where: {
        userId_jobTitle_companyName: { userId, jobTitle, companyName },
      },
      update: { dates, startDate, endDate, isCurrent, duties },
      create: {
        id: ulidId(),
        userId,
        jobTitle,
        companyName,
        dates,
        startDate,
        endDate,
        isCurrent,
        duties,
      },
    });

    return { success: true, experience: toWorkExperienceDto(experience) };
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
  const experiences = await prisma.workExperience.findMany({
    where: { userId },
    orderBy: [
      { isCurrent: "desc" },
      { startDate: { sort: "desc", nulls: "last" } },
      { endDate: { sort: "desc", nulls: "last" } },
    ],
  });

  return experiences.map(toWorkExperienceDto);
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
  const skillId = String(formData.get("skillId") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();

  if (!userId || session.user.status !== "ACTIVE") {
    return { error: { message: "Please sign in before adding a skill." } };
  }

  if (!text) {
    return { error: { message: "Text should not be blank." } };
  }
  
  try {
    if (skillId) {
      const existing = await prisma.skill.findFirst({
        where: { id: skillId, userId },
        select: { id: true },
      });

      if (!existing) {
        return { error: { message: "Skill not found." } };
      }

      const duplicate = await prisma.skill.findUnique({
        where: { text_userId: { text, userId } },
        select: { id: true },
      });

      if (duplicate && duplicate.id !== skillId) {
        return { error: { message: "That skill is already on your profile." } };
      }

      const skill = await prisma.skill.update({
        where: { id: skillId },
        data: { text },
      });

      return { success: true, skill };
    }

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

type SkillDeleteResult =
  | { success: true }
  | { error: { message: string } };

export async function deleteUserSkill(id: string): Promise<SkillDeleteResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user.status !== "ACTIVE") {
    return { error: { message: "Please sign in before deleting a skill." } };
  }

  try {
    const result = await prisma.skill.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      return { error: { message: "Skill not found." } };
    }

    return { success: true };
  } catch {
    return { error: { message: "Unable to delete the skill right now." } };
  }
}
