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
    <button onClick={handleSignOut} className="text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-50 transition-colors">
      {children ?? "Sign out"}
    </button>
  );
}
