import Link from "next/link";

const NavigationBar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-30 hover:shadow-sm shadow-fuchsia-400 bg-indigo-950">
      <div className="flex w-full justify-between items-center px-2 md:px-8 py-2">
        <Link href={'/'} className="text-gray-100 font-semibold text-xl hover:text-gray-300">
          Kubuka Hub
        </Link>
        <div>
          <Link href={'/signin'} className="border border-gray-100 rounded-md px-2 py-1 text-gray-100 hover:text-indigo-950 hover:bg-gray-100">Sign in</Link>
        </div>
      </div>
    </nav>
  );
}

export { NavigationBar };