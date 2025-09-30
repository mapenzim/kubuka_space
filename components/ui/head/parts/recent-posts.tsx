/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";
import { Ctx } from "~/context/provider";

const RecentPosts = () => {
  const { recentPosts }: any = Ctx();
  
  return (
    <div className="px-5 py-5 bg-gray-50 sm:px-8 sm:py-8">
      <div>
        <h3 className="text-sm tracking-wide font-medium text-gray-500 uppercase">Recent Posts</h3>
        <ul role="list" className="mt-4 space-y-4">
          {recentPosts.map((post: { id: Key | null | undefined; href: string; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
            <li key={post.id} className="text-base truncate">
              <Link href={post.href} className="font-medium text-gray-900 hover:text-gray-700">
                {post.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 text-sm">
        <Link href="/blog" className="font-medium text-indigo-600 hover:text-indigo-500">
          {' '}
            View all posts <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export { RecentPosts };