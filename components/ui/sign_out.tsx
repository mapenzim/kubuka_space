'use client';

import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignoutButton({ children, close }: { children?: React.ReactNode; close: any }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh(); // 🔥 refresh server components (NavigationBar)
    close();
  };

  return (
    <div className="p-3">
      <form
        action={handleSignOut}
      >
        <button
          type="submit"
          className="flex items-center gap-x-2 w-full rounded-lg px-3 py-2 text-left text-gray-900 hover:bg-gray-100 cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4 text-gray-600" aria-hidden="true" />
          { children ?? "Sign out"}
        </button>
      </form>
    </div>
  );
}
