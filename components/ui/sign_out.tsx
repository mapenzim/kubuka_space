'use client';

import { Button } from "@radix-ui/themes";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Form from "@radix-ui/react-form";
import { clearUserChatSession } from "@/lib/chat/client/guest_session";

export function SignoutButton({ children, close }: { children?: React.ReactNode; close: () => void }) {
  const router = useRouter();

  const handleSignOut = async () => {
    clearUserChatSession();
    await signOut({ redirect: false });
    // clear guest cart before signout
    localStorage.removeItem("tempCart");
    localStorage.removeItem("tempCartId");
    router.refresh(); // 🔥 refresh server components (NavigationBar)
    close();
  };

  return (
    <Form.Root action={handleSignOut}>
      <Form.Submit asChild>
        <Button className="flex w-full items-center justify-between">
          { children ?? "Sign out"}
          <LogOutIcon className="w-4 h-4 text-gray-600" aria-hidden="true" />
        </Button>
      </Form.Submit>
    </Form.Root>
  );
}
