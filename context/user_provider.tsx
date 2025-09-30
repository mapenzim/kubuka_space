import { createContext, ReactNode, useContext } from "react";
import { auth } from "~/lib/auth";

type Props = {
  children?: ReactNode;
};
const CTX : any = createContext(null);

const UserProvider = async ({ children }: Props) => {
  const session = await auth();

  return <CTX value={session}>{children}</CTX>;
}

const userCTX = () => useContext(CTX);

export { UserProvider, userCTX };