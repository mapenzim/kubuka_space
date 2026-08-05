import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/roles";
import { cookies } from "next/headers";
import AdminReauthGate from "@/components/admin/AdminReauthGate";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/authentication?callbackUrl=/admin");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/");
  }

  const adminReauth = (await cookies()).get("kubuka_admin_reauth")?.value;
  if (adminReauth !== "confirmed") {
    return <AdminReauthGate />;
  }

  return (
    <AdminShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      {children}
    </AdminShell>
  );
}
