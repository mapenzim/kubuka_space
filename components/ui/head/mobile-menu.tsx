/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Transition, PopoverPanel, PopoverButton } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Fragment, JSX, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { Ctx } from "~/context/provider";
import { signOut } from "~/lib/auth";

export const MobileHead = () => {

  const { user, solutions, resources }: any = Ctx();

  return (
    <Transition
      as={Fragment}
      enter="duration-200 ease-out"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="duration-100 ease-in"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <PopoverPanel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
          <div className="pt-5 pb-6 px-5">
            <div className="flex items-center justify-between">
              <div>
                <Image
                  className="h-8 w-auto"
                  src={'/images/kubuka-logo.png'}
                  alt="kubuka"
                  width={20}
                  height={20}
                />
              </div>
              <div className="-mr-2">
                <PopoverButton className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </PopoverButton>
              </div>
            </div>
            <div className="mt-6">
              <nav className="grid gap-y-8">
                {solutions.map((item: { name: boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Key | null | undefined; href: string | undefined; icon: JSX.IntrinsicAttributes; }, index: Key | null | undefined) => (
                  <a
                    key={index}
                    href={item.href}
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                  >
                    <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
          <div className="py-6 px-5 space-y-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <Link href="/store" className="text-base font-medium text-gray-900 hover:text-gray-700">
                Store
              </Link>

              <Link href="/blog" className="text-base font-medium text-gray-900 hover:text-gray-700">
                Blog
              </Link>
              {resources.map((item: { name: boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Key | null | undefined; href: any; }, index: any) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {
              !user ?
                <div>
                  <Link
                    href='/signup'
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign up
                  </Link>
                  <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Existing customer?{' '}
                    <Link href="/signin" className="text-indigo-600 hover:text-indigo-500">
                      Sign in
                    </Link>
                  </p>
                </div>
                :
                <button
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
            }
          </div>
        </div>
      </PopoverPanel>
    </Transition>
  );
}