import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminReauthGate from "@/components/admin/AdminReauthGate";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminActiveSnippetRequestCount } from "@/app/actions/snippetActions.server";
import { getActiveBackofficeActor } from "@/lib/admin/require_admin";
import { hasPermission, PERMISSIONS } from "@/lib/rbac/policy";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getActiveBackofficeActor();

  if (!admin) {
    redirect("/authentication?callbackUrl=/admin");
  }

  const adminReauth = (await cookies()).get("kubuka_admin_reauth")?.value;
  if (adminReauth !== "confirmed") {
    return <AdminReauthGate />;
  }

  const activeSnippetRequestCount = hasPermission(admin.role, PERMISSIONS.SNIPPETS_MANAGE)
    ? await getAdminActiveSnippetRequestCount()
    : 0;

  return (
    <AdminShell
      initialActiveSnippetRequestCount={activeSnippetRequestCount}
      user={{
        name: admin.name,
        email: admin.email,
        image: admin.image,
        role: admin.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
