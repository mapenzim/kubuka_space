export const dynamic = "force-dynamic";

import Link from "next/link";
import { formatName } from "@/lib/utils";
import { getAllPosts } from "@/app/actions/postActions.server";
import { Box, Card, Flex, Heading, Inset, Strong, Text } from "@radix-ui/themes";
import { auth } from "@/auth";

export default async function Posts() {
  const posts = await getAllPosts();
  const session = await auth();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-400">Posts</h1>
          {session?.user && <Link
              href="/posts/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              New Post
            </Link>
          }
        </div>
        <div className="space-y-4 flex flex-col md:flex-row md:flex-wrap w-full space-x-3">
          {posts.map((post: { id: string; title: string; author: { name: any; }; }) => (
            <Box width="280px" key={post.id}>
              <Card size="2">
                <Inset clip="padding-box" side="top" pb="current">
                  <img
                    src="/svgs/cover.avif"
                    alt="Bold typography"
                    style={{
                      display: "block",
                      objectFit: "cover",
                      width: "100%",
                      height: 140,
                      backgroundColor: "var(--gray-5)",
                    }}
                  />
                </Inset>
                <Flex className="flex-col">
                  <Heading as="h5" className="text-justify">{post.title}</Heading>
                </Flex>
                <Text as="p" size="3">
                  <Strong>{formatName(post.author.name)}</Strong>
                </Text>
              </Card>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
}

/*

            <Link
              key={post.id}
              href={`/posts/${String(post.id)}?title=${post?.title?.split(" ").join("-").toLowerCase()}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <article className="bg-white dark:bg-zinc-700 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-2">
                  {post.title}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  by {formatName(post.author.name)}
                </div>
              </article>
            </Link>*/