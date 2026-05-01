export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
 
export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    }
  }); 

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Posts</h1>
      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.id} className="bg-white p-3 shadow rounded">
            <strong>{p.title}</strong> — {p.content}
            <div className="text-sm text-gray-500">By: {p.author?.name ?? "Unknown"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
