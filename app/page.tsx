import { unstable_noStore as noStore } from "next/cache";
// import Image from "next/image";
// import Link from "next/link";

// import { SignInButton, SignOutButton } from "@/components/auth";
import Image from "next/image";
/*import { formatName } from "@/lib/utils";

import type { User } from "@prisma/client";
import type { Session } from "next-auth";

/*
function UserMenu({ user }: { user: NonNullable<Session["user"]> }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
        {user.image ? (
          <Image
            src={user.image}
            alt={formatName(user.name)}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">
              {(user.name || "U").charAt(0)}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {formatName(user.name)}
        </span>
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="absolute right-0 mt-1 w-36 py-1 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <Link
          href={`/users/${user.id}`}
          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-50 transition-colors"
        >
          View profile
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <Link
      href={`/users/${user.id}`}
      className="block transition-transform hover:scale-[1.02]"
    >
      <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {user.image ? (
          <Image
            src={user.image}
            alt={formatName(user.name)}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">
              {(user.name || "User").charAt(0)}
            </span>
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">
            {formatName(user.name)}
          </div>
        </div>
      </div>
    </Link>
  );
}
*/

export default async function Home() {
  noStore();

  // const session = await auth();
  // limit to 100 users and cache for 60 seconds.
  /*const users = await prisma.user.findMany({
    take: 100,
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });*/

  return (
      <section className="flex flex-col gap-6">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <div className="max-w-prose md:max-w-none">
                <h4 className="text-lg font-bold text-red-700">
                  Maintenance Mode
                </h4>
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Kubuka Space PBC</h2>
                <p className="mt-4 text-gray-700">
                  The website is still under maintenance. Kubuka will come back stronger in a moment. 
                </p>
              </div>
            </div>
            <div>
              <Image
                src="https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="rounded"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
  );
}
