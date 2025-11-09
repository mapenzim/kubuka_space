import { auth } from "@/auth";
import Link from "next/link";
import { SignOutButton } from "../auth";
import { ListEnd, StoreIcon } from "lucide-react";
import { SignoutButton } from "./sign_out";

const NavigationBar = async () => {
  const session = await auth();

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
        {session?.user
          ? <SignoutButton /> 
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