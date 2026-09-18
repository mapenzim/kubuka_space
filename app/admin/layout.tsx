import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminReauthGate from "@/components/admin/AdminReauthGate";
import AdminShell from "@/components/admin/AdminShell";
import { getActiveAdmin } from "@/lib/admin/require_admin";
import prisma from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getActiveAdmin();

  if (!admin) {
    redirect("/authentication?callbackUrl=/admin");
  }

  const adminReauth = (await cookies()).get("kubuka_admin_reauth")?.value;
  if (adminReauth !== "confirmed") {
    return <AdminReauthGate />;
  }

  const activeSnippetRequestCount = await prisma.snippetRequest.count({
    where: { status: { notIn: ["DELIVERED", "REJECTED"] } },
  });

  return (
    <AdminShell
      initialActiveSnippetRequestCount={activeSnippetRequestCount}
      user={{
        name: admin.name,
        email: admin.email,
        image: admin.image,
      }}
    >
      {children}
    </AdminShell>
  );
}
