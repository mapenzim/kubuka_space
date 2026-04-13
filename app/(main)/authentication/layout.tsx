import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session?.user) return redirect("/");

  return (
    <div className="w-full overflow-auto">
      <div className="min-h-screen items-center justify-center">
        <div className="relative">
          <div className="md:w-full mx-auto px-2 md:px-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
