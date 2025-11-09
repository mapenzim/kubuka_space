'use client';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignoutButton({ children }: { children?: React.ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh(); // 🔥 refresh server components (NavigationBar)
  };

  return (
    <button onClick={handleSignOut}>
      {children ?? "Sign out"}
    </button>
  );
}
