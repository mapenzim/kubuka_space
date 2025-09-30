"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";
import { Ctx } from "~/context/provider";

const StoreFront = () => {
  const { storeItems }: any = Ctx();
  return (
    <div className="flex flex-col w-full h-full justify-start items-center pt-16">
      <h1 className="text-amber-300 text-6xl mb-8 border px-16">Store Front</h1>
      <div className="grid grid-cols-3 gap-4">
        {storeItems?.map((item: { plan: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: any; packages: (string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined)[]; }, index: Key | null | undefined) => (
        <Link 
          key={index} 
          className="even:bg-lime-300 bg-gray-300 rounded-2xl p-6 shadow-lg w-full odd:h-92 even:h-96 cursor-pointer transition ease-in-out delay-[10ms] duration-300 hover:translate-x-0 hover:scale-110"
          href={`/store/check-out?plan=${item?.plan}`}
        >
          <h3 className="text-3xl text-indigo-500 capitalize mb-1">{item?.plan}</h3>
          <p className="mb-6 leading-3 lining-nums text-indigo-400">{`Price: $${item?.price}.00`}</p>
          <ul className="list-disc marker:text-cyan-500 list-outside ml-5">
            {item?.packages?.map((pac: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
              <li key={index} className="capitalize text-xs">{pac}</li>
            ))}
          </ul>
        </Link>
        ))}
      </div>
    </div>
  );
}

export { StoreFront };