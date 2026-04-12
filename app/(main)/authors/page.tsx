export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatName } from "@/lib/utils";

export default async function Authors() {
  const authors = await prisma.user.findMany({
    /*where: {
      posts: null,
    },*/
    orderBy: {
      createdAt: "desc",
    }
  }); 

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-400">Authors</h1>
        </div>
        <div className="space-y-4">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/authors/${author.id}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <article className="bg-white dark:bg-zinc-700 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-300 mb-2">
                  {author.email}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  by {formatName(author.name ?? "User")}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
