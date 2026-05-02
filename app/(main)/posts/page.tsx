export const dynamic = "force-dynamic";

import Link from "next/link";
import { formatName } from "@/lib/utils";
import { getAllPosts } from "@/app/actions/postActions.server";
import { Box, Button, Card, Flex, Heading, Inset, Text } from "@radix-ui/themes";
import { auth } from "@/auth";

export default async function Posts() {
  const posts = await getAllPosts();
  const session = await auth();

  if (posts.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-16 md:py-16">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No posts available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-16 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-400">
            Blog
          </h1>
          {session?.user && <Link
              href={`/posts/new`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              New Post
            </Link>
          }
        </div>
        <div className="space-y-4 flex flex-col md:flex-row md:flex-wrap w-full space-x-4">
          {posts.map((post: { id: string; title: string; author: { id: string; name: any; email: string; image: any; }; }) => (
            <Box width="240px" key={post.id} >
              <Card size="2">
                <Inset clip="padding-box" side="top" pb="current">
                  <img
                    src={post.author.image || "/svgs/cover.avif"}
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
                  <Heading as="h1" className="text-justify">
                    <Link href={`/posts/${post.id}/read`}>{post.title}</Link>
                  </Heading>
                </Flex>
                <Flex direction={'row'} justify={'between'}>
                  <Text as="p" size="3" asChild>
                    <Link href={`/authors/${post.author.id}`}>{formatName(post.author.name)}</Link>
                  </Text>
                  {session?.user && session?.user.email === post.author.email && 
                    <Link href={`/posts/${post.id}`}>
                      <Button variant="ghost" size="1">
                        Update
                      </Button>
                    </Link>
                  }
                </Flex>
              </Card>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
}
