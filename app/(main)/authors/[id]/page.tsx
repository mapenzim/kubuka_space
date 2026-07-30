export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { formatName } from "@/lib/utils";
import { Box, Card, Container, Flex, Heading, Text, Avatar, Button, Badge, Grid } from "@radix-ui/themes";

/**
 * ---------------------------
 * Types
 * ---------------------------
 */
interface Post {
  id: string;
  title: string;
  content?: string | null;
  published: boolean;
}

export default async function AuthorProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: id },
    include: {
      posts: {
        orderBy: { id: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.email === user.email;
  
  // Filter posts depending on who is viewing
  const posts: Post[] = isOwnProfile
    ? user.posts as unknown as Post[] // Type assertion depending on your Prisma schema
    : user.posts.filter((post: { published: any; }) => post.published) as unknown as Post[];

  const isEmpty = posts.length === 0;
  const fallbackLetter = user.name?.charAt(0) || user.email?.charAt(0) || "?";

  return (
    <Box className="min-h-screen bg-zinc-50 dark:bg-zinc-950! py-16 px-4 transition-colors duration-200">
      <Container size="3">
        
        {/* 👤 Profile Header Card */}
        <Card 
          size="4" 
          className="bg-white! dark:bg-zinc-900! border-zinc-200 dark:border-zinc-800! shadow-sm mb-8 rounded-2xl"
          variant="ghost"
        >
          <Flex align="center" gap="6">
            <Avatar
              size={{ initial: "4", sm: "7" }}
              src={user.image || undefined}
              fallback={fallbackLetter.toUpperCase()}
              color="iris"
              radius="full"
              className="shadow-sm border border-zinc-100 dark:border-zinc-800"
            />
            
            <Box>
              <Heading as="h1" size={{ initial: "3", md: "7" }} weight="bold" className="text-zinc-900 dark:text-zinc-400 mb-2">
                {formatName(user.name ?? "User")}
              </Heading>
              <Link
                href="/authors"
                className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-(--iris-11) dark:hover:text-(--iris-11) transition-colors inline-flex items-center gap-1"
              >
                &larr; Back to all authors
              </Link>
            </Box>
          </Flex>
        </Card>

        {/* 📝 Posts Section */}
        <Box mt='8'>
          <Flex align="center" justify="between" mb="5">
            <Heading as="h2" size="6" className="text-zinc-900 dark:text-zinc-400">
              {isOwnProfile ? "Your Posts" : "Published Posts"}
            </Heading>
            {isOwnProfile && (
              <Button size="2" asChild className="cursor-pointer text-zinc-400!">
                <Link href="/posts/new">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Post
                </Link>
              </Button>
            )}
          </Flex>

          {isEmpty ? (
            <Card 
              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 py-12 text-center border-dashed"
              m="4"
            >
              <Text as="p" size="3" color="gray" mb={isOwnProfile ? "4" : "0"}>
                {isOwnProfile
                  ? "You haven't published any posts yet."
                  : "No published posts yet."}
              </Text>
              
              {isOwnProfile && (
                <Link
                  href="/posts/new"
                  className="inline-flex items-center gap-1 text-(--iris-11) hover:underline font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write your first post
                </Link>
              )}
            </Card>
          ) : (
            
            <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="4">
              {posts.map((post) => (
                <Card 
                  key={post.id} 
                  size="2" 
                  variant="ghost"
                  m="4"
                  asChild 
                  className="border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer min-h-30"
                >
                  <Link href={`/posts/${post.id}/read`} className="outline-none block h-full">
                    <Flex direction="column" justify="between" className="h-full">
                      
                      {/* Title clamped to 2 lines for uniform card heights */}
                      <Heading as="h3" size="4" className="text-zinc-900 dark:text-gray-500 line-clamp-2 mb-4 leading-snug">
                        {post.title}
                      </Heading>
                      
                      {/* Bottom row: Badge (Left) & Read Prompt (Right) */}
                      <Flex align="center" justify="between" mt="auto">
                        <Box>
                          {!post.published && (
                            <Badge color="orange" variant="soft" size="1">
                              Draft
                            </Badge>
                          )}
                        </Box>

                        <Text size="2" weight="medium" className="text-zinc-500 dark:text-zinc-500 group-hover:text-(--iris-11) transition-colors">
                          Read &rarr;
                        </Text>
                      </Flex>

                    </Flex>
                  </Link>
                </Card>
              ))}
            </Grid>

          )}
        </Box>
        
      </Container>
    </Box>
  );
}
