"use client";

import { PropsType } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children }: PropsType) => {
  return <SessionProvider>{ children }</SessionProvider>;
}

export { Provider };