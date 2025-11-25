import { auth } from "@/auth";
import Link from "next/link";
import { ListEnd, StoreIcon } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const NavigationBar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="fixed top-0 right-0 left-0 z-30 hover:shadow-sm shadow-fuchsia-400 bg-indigo-950">
      <div className="flex w-full justify-between items-center px-2 md:px-8 py-2">
        <Link href={'/'} className="text-gray-100 font-semibold text-xl hover:text-gray-300">
          Kubuka Hub
        </Link>
        <div className="flex gap-x-4">
          <div className="flex gap-x-1 items-center justify-center text-indigo-400 hover:text-indigo-600">
            <StoreIcon className="w-4 h-4" />
            <Link href="/store" className="">Shop</Link>
          </div>
          <div className="flex gap-x-1 items-center justify-center text-indigo-400 hover:text-indigo-600">
            <ListEnd className="w-4 h-4" />
            <Link href="/posts" className="">Blog</Link>
          </div>
        </div>
        {user
          ? <Popover __demoMode>
              <PopoverButton className="block text-sm/6 font-semibold text-white/50 focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
                {user.name}
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-closed:-translate-y-1 data-closed:opacity-0"
              >
                <div className="p-3">
                  <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-white">Insights</p>
                    <p className="text-white/50">Measure actions your users take</p>
                  </a>
                  <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-white">Automations</p>
                    <p className="text-white/50">Create your own targeted content</p>
                  </a>
                  <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-white">Reports</p>
                    <p className="text-white/50">Keep track of your growth</p>
                  </a>
                </div>
                <div className="p-3">
                  <a className="block rounded-lg px-3 py-2 transition hover:bg-white/5" href="#">
                    <p className="font-semibold text-white">Documentation</p>
                    <p className="text-white/50">Start integrating products and tools</p>
                  </a>
                </div>
              </PopoverPanel>
            </Popover>
          : <Link 
              href="/authentication"
              className="border border-gray-100 rounded-md px-2 py-1 text-gray-100 hover:text-indigo-950 hover:bg-gray-100"
            >
              Sign in
            </Link>
        }
      </div>
    </nav>
  );
}

export { NavigationBar };