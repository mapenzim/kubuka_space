import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) { redirect("/authentication"); }

  if ((session.user as any).role !== "ADMIN") {return <div>Access denied - Only Admin</div>;}

  return (
    <div>
      Welcome admin
    </div>
  );
}
