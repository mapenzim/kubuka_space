import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session) { redirect("/authentication"); }

  if ((session.user as any).role !== "ADMIN") {return <div>Access denied - Only Admin</div>;}

  return (
    <div>
      Welcome admin
    </div>
  );
}
