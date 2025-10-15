import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

import type { Role, User } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export function formatName(fullName: User["name"] | undefined): string {
  if (!fullName) return "Anonymous User";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export function containsProfanity(text: string): boolean {
  return matcher.hasMatch(text);
}

export async function requireAnyRole(roles: Role[]) {
  const session = await auth();

  if (!session) {
    const { headers } = await import("next/headers");

    const currentUrl = (await headers()).get("referer") || "/";
    redirect(`authentication?callbackUrl=${encodeURIComponent(currentUrl)}`);
  }

  if (!roles.includes((session.user as any).role)) {
    redirect("/not-authorized");
  }

  return session;
}

export type PropsType = {
  children?: ReactNode;
};