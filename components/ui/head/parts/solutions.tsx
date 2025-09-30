"use client";

import Link from "next/link";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, JSX, Key } from "react";
import { Ctx } from "~/context/provider";

const Solutions = () => {
  const { solutions }: any = Ctx();

  return (
    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
      {solutions.map((item: { name: ReactElement<string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> >; href: string; icon: JSX.IntrinsicAttributes; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
        <Link
          key={index}
          href={item.href}
          className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
        >
          <div className="ml-4">
            <p className="text-base font-medium text-gray-900">{item.name}</p>
            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export { Solutions };
