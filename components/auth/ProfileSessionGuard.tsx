"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileSessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const accountIsInactive =
    status === "authenticated" &&
    Boolean(session?.user?.status) &&
    session.user.status !== "ACTIVE";
  const shouldRedirect =
    status === "unauthenticated" || accountIsInactive;

  useEffect(() => {
    if (!shouldRedirect) {
      return;
    }

    const callbackUrl = encodeURIComponent(pathname || "/profile");
    router.replace(`/authentication?callbackUrl=${callbackUrl}`);
    router.refresh();
  }, [pathname, router, shouldRedirect]);

  if (status === "loading" || shouldRedirect) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid min-h-[60vh] place-items-center bg-zinc-50 px-4 text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400"
      >
        {shouldRedirect ? "Redirecting to sign in…" : "Checking your session…"}
      </div>
    );
  }

  return children;
}
