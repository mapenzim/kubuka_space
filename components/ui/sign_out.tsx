'use client';

import { Button } from "@radix-ui/themes";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Form from "@radix-ui/react-form";

export function SignoutButton({ children, close }: { children?: React.ReactNode; close: any }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
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
