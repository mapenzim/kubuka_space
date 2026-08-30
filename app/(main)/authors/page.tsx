export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatName } from "@/lib/utils";
import { Box, Card, Container, Flex, Grid, Heading, Text, Avatar } from "@radix-ui/themes";

export default async function Authors() {
  const authors = await prisma.user.findMany({
    where: {
      posts: {
        some: { published: true },
      },
    },
    include: {
      posts: {
        where: { published: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const isEmpty = authors.length === 0;

  return (
    <Box className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4 transition-colors duration-200">
      <Container size="4">
        
        {/* Header */}
        <Flex justify="between" align="center" mb="8">
          <Heading as="h1" size="8" color="gray" highContrast className="dark:text-zinc-400!">
            Authors
          </Heading>
        </Flex>

        {/* Empty State */}
        {isEmpty ? (
          <Box py="9">
            <Text size="4" color="gray">
              No authors have published posts yet.
            </Text>
          </Box>
        ) : (
          <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
            {authors.map((author) => {
              const postCount = author.posts.length;
              // Fallback to first letter of name, then email, then "?"
              const fallbackLetter = author.name?.charAt(0) || author.email?.charAt(0) || "?";

              return (
                <Card
                  key={author.id}
                  size="1"
                  className="bg-white dark:bg-zinc-900! border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                  variant="ghost"
                  m={"4"}
                  asChild
                >
                  <Link href={`/authors/${author.id}`}>
                    <Flex gap="4" align="center">
                      
                      {/* Avatar */}
                      <Avatar
                        size="5"
                        src={author.image || undefined}
                        fallback={fallbackLetter.toUpperCase()}
                        color="iris"
                        radius="full"
                        className="shadow-sm border border-zinc-100 dark:border-zinc-800"
                      />

                      {/* Author Info */}
                      <Flex direction="column">
                        <Text size="4" weight="bold" className="text-zinc-900 dark:text-zinc-400 leading-tight">
                          {formatName(author.name ?? "User")}
                        </Text>
                        
                        <Text size="2" color="gray" className="truncate max-w-50 dark:text-zinc-500!">
                          {author.email}
                        </Text>

                        {/* Post Count Badge/Text */}
                        <Text size="1" weight="medium" className="text-(--iris-11) mt-1">
                          {postCount} published post{postCount === 1 ? "" : "s"}
                        </Text>
                      </Flex>

                    </Flex>
                  </Link>
                </Card>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
