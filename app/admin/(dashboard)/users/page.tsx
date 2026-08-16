import { getAllUsers } from "@/app/actions/adminActions.server";
import { auth } from "@/auth";
import UserManager from "@/components/admin/UserManager";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/authentication?callbackUrl=/admin/users");
  }

  const users = await getAllUsers();

  return (
    <UserManager
      actorId={session.user.id}
      actorRole={session.user.role as "ADMIN" | "SUPERUSER"}
      users={users.map((user) => ({
        ...user,
        role: (user.role?.name ?? "USER") as "USER" | "EDITOR" | "ADMIN",
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        suspendedAt: user.suspendedAt?.toISOString() ?? null,
        archivedAt: user.archivedAt?.toISOString() ?? null,
      }))}
    />
  );
}
