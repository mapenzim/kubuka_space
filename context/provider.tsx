import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

type ProviderProps = {
  children: React.ReactNode;
  session: Session | null;
};

export default async function Provider({
  children,
  session,
}: ProviderProps) {

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
