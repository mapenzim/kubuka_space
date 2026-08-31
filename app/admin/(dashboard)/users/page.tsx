import { getAllUsers } from "@/app/actions/adminActions.server";
import UserManager from "@/components/admin/UserManager";
import { requireAdmin } from "@/lib/admin/require_admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [actor, users] = await Promise.all([requireAdmin(), getAllUsers()]);

  return (
    <UserManager
      actorId={actor.id}
      actorRole={actor.role}
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
