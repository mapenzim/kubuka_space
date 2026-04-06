"use client";

import Link from "next/link";
import { ListEnd, ShoppingCartIcon, StoreIcon } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { SignoutButton } from "./sign_out";
import { useSession } from "next-auth/react";
import CartStatus from "../cart/components/cart_status";

const NavigationBar = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <nav className="fixed top-0 right-0 left-0 z-30 bg-indigo-950 shadow-sm hover:shadow-md">
      <div className="flex w-full justify-between items-center px-2 md:px-8 py-2">
        <Link
          href="/"
          className="text-gray-100 font-semibold text-xl hover:text-gray-300"
        >
          Kubuka Hub
        </Link>

        <div className="flex gap-x-4">
          <Link
            href="/store"
            className="flex gap-x-1 items-center text-indigo-200 hover:text-indigo-600"
          >
            <StoreIcon className="w-4 h-4" aria-hidden="true" />
            Shop
          </Link>
          <Link
            href="/posts"
            className="flex gap-x-1 items-center text-indigo-200 hover:text-indigo-600"
          >
            <ListEnd className="w-4 h-4" aria-hidden="true" />
            Blog
          </Link>
        </div>

        <div className="flex gap-8">
          <CartStatus />

        {user ? (
          <Popover>
            <PopoverButton className="block text-sm font-semibold text-white hover:text-white focus:outline-none cursor-pointer">
              {user.name}
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="divide-y z-30 -translate-x-4 translate-y-4 divide-gray-200 rounded-xl bg-white text-sm shadow-lg transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-closed:-translate-y-1 data-closed:opacity-0"
            >
              {({ close }) => (
              <>
                <div className="p-3">
                  <Link
                    href="/insights"
                    onClick={() => close()} // ✅ closes popover
                    className="block rounded-lg px-3 py-2 transition hover:bg-gray-100"
                  >
                    <p className="font-semibold text-gray-900">Insights</p>
                    <p className="text-gray-500">Measure actions your users take</p>
                  </Link>
                  <Link
                    href="/automations"
                    onClick={() => close()}
                    className="block rounded-lg px-3 py-2 transition hover:bg-gray-100"
                  >
                    <p className="font-semibold text-gray-900">Automations</p>
                    <p className="text-gray-500">Create your own targeted content</p>
                  </Link>
                </div>
                <SignoutButton close={close} />
              </>
            )}
            </PopoverPanel>
          </Popover>
        ) : (
          <Link
            href="/authentication"
            className="border border-gray-100 rounded-md px-2 py-1 text-gray-100 hover:text-indigo-950 hover:bg-gray-100"
          >
            Sign in
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
};

export { NavigationBar };