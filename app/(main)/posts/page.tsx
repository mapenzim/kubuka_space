import Link from "next/link";
import { formatName } from "@/lib/utils";
import { getAllPosts } from "@/app/actions/postActions.server";
import { Box, Button, Card, Flex, Grid, Heading, Inset, Text, Container } from "@radix-ui/themes";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

/**
 * ---------------------------
 * Types
 * ---------------------------
 */
interface PostAuthor {
  id: string;
  name: any;
  email: string;
  image: any;
}

interface Post {
  id: string;
  title: string;
  author: PostAuthor;
}

/**
 * ---------------------------
 * Page
 * ---------------------------
 */
export default async function Posts() {
  const posts: Post[] = await getAllPosts();
  const session = await auth();

  const isEmpty = posts.length === 0;

  return (
    <Box className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200 pt-16 py-32 px-6">
      <Container size="4">
        
        {/* Header */}
        <Flex justify="between" align="center" mb="8">
          <Heading as="h1" size="8" color="gray" className="dark:text-zinc-400!" highContrast>
            Blog
          </Heading>
          
          {session?.user && (
            <Button size="3" asChild className="cursor-pointer">
              <Link href={`/posts/new`}>New Post</Link>
            </Button>
          )}
        </Flex>

        {/* Empty State */}
        {isEmpty ? (
          <Box py="9">
            <Text size="4" color="cyan" weight="medium" align="center" className="dark:text-orange-400!">
              No posts available right now. Check back later!
            </Text>
          </Box>
        ) : (
          <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="6" width="auto">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                size="2" 
                variant="ghost"
                m={"4"}
                className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
              >
                {/* Image Cover */}
                <Inset clip="padding-box" side="top" pb="current">
                  <img
                    src={post.author.image || "/svgs/cover.avif"}
                    alt={`Cover image for ${post.title}`}
                    style={{
                      display: "block",
                      objectFit: "cover",
                      width: "100%",
                      height: 160,
                      backgroundColor: "var(--gray-5)",
                    }}
                  />
                </Inset>

                {/* Card Content */}
                <Flex direction="column" gap="4" pt="3">
                  
                  {/* Title (Clamped to 2 lines so heights stay uniform) */}
                  <Heading as="h2" size="4" className="line-clamp-2 leading-snug">
                    <Link 
                      href={`/posts/${post.id}/read`}
                      className="text-zinc-900 dark:text-zinc-400 hover:text-(--iris-11) transition-colors before:absolute before:inset-0"
                    >
                      {post.title}
                    </Link>
                  </Heading>

                  {/* Footer (Author & Actions) */}
                  <Flex direction="row" justify="between" align="center" mt="auto">
                    <Text size="2" color="gray" weight="medium" className="relative z-10 hover:underline dark:text-zinc-500!">
                      <Link href={`/authors/${post.author.id}`}>
                        {formatName(post.author.name)}
                      </Link>
                    </Text>

                    {session?.user?.email === post.author.email && (
                      <Text size="2" color="gray" className="relative z-10 hover:underline dark:text-zinc-500! dark:hover:text-teal-600!" asChild >
                        <Link href={`/posts/${post.id}`}>
                          Update
                        </Link>
                      </Text>
                    )}
                  </Flex>
                  
                </Flex>
              </Card>
            ))}
          </Grid>
        )}
        
      </Container>
    </Box>
  );
}
