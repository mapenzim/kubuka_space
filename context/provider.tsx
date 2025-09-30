/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, ReactNode, useContext, useState } from "react";
import { solutions, resources, callsToAction, recentPosts, storeItems } from "~/lib/head_utils";

type Props = {
  children?: ReactNode;
};

const NewContextProvider: any = createContext('');

const ContextProvider = ({ children } : Props) => {

  const value = {
    solutions,
    resources,
    callsToAction,
    recentPosts,
    storeItems
  };

  return (
    <SessionProvider>
      <NewContextProvider value={value}>
        {children}
      </NewContextProvider>
    </SessionProvider>
  );
}

const Ctx = () => useContext(NewContextProvider);

export { ContextProvider, Ctx };
