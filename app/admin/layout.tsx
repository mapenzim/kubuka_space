import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminReauthGate from "@/components/admin/AdminReauthGate";
import AdminShell from "@/components/admin/AdminShell";
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

  return (
    <AdminShell
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
