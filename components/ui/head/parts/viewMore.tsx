"use client";

import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, JSX, Key } from "react";
import { Ctx } from "~/context/provider";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ViewMore = () => {
  const { callsToAction }: any = Ctx();
  return (
    <div className="px-5 py-5 bg-gray-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
      {callsToAction.map((item: { name: ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode>>; href: string; icon: JSX.IntrinsicAttributes; }, index: Key | null | undefined) => (
        <div key={index} className="flow-root">
          <Link
            href={item.href}
            className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
          >
           <span className="ml-3">{item.name}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

export { ViewMore };
