import Link from "next/link";

const NavigationBar = () => {
  return (
    <nav className="bg-white fixed top-0 right-0 left-0 z-30 hover:shadow-sm shadow-fuchsia-400">
      <div className="flex w-full justify-between items-center px-2">
        <Link href={'/'} className="text-indigo-700">
          Kubuka Hub
        </Link>
        <div>
          <Link href={'/signin'} className="text-indigo-600">Sign in</Link>
        </div>
      </div>
    </nav>
  );
}

export { NavigationBar };