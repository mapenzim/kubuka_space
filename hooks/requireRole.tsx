"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRequireRole(allowed: string[]) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role;
    if (!role || !allowed.includes(role)) {
      // redirect to sign-in or unauthorized page
      router.replace("/signin");
    }
  }, [status, session, allowed, router]);

  return { session, status };
}
