import { useSession } from "next-auth/react";
import { can } from "@/lib/roles";

export default function CreateUserButton() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;
  if (!role || !can.createUser(role as any)) return null;

  return (<button>Create user</button>);
}
