import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminReauthGate from "@/components/admin/AdminReauthGate";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminActiveSnippetRequestCount } from "@/app/actions/snippetActions.server";
import { getActiveAdmin } from "@/lib/admin/require_admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getActiveAdmin();

  if (!admin) {
    redirect("/authentication?callbackUrl=/admin");
  }

  const adminReauth = (await cookies()).get("kubuka_admin_reauth")?.value;
  if (adminReauth !== "confirmed") {
    return <AdminReauthGate />;
  }

  const activeSnippetRequestCount = await getAdminActiveSnippetRequestCount();

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
