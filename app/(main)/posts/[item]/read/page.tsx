import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { formatName } from "@/lib/utils";
import { getPost } from "@/app/actions/postActions.server";
import { auth } from "@/auth";
import { ClientViewer } from "@/components/lexical-editor/client-viewer";
import { Box, Card, Flex, Heading, Text, Badge, Button, Container } from "@radix-ui/themes";

export const dynamic = "force-dynamic";

/**
 * ---------------------------
 * Helpers
 * ---------------------------
 */
function calculateReadTime(content: string | undefined | null): string {
  if (!content) return "1 min read";
  
  // Extract words using a regex boundary (works decently well for stripping HTML/JSON noise)
  const wordCount = content.match(/\b\w+\b/g)?.length || 0;
  
  // Average adult reading speed is ~225 words per minute
  const wordsPerMinute = 225; 
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  
  return minutes === 1 ? "1 min read" : `${minutes} mins read`;
}

/**
 * ---------------------------
 * Page
 * ---------------------------
 */
export default async function ReadPage({ params }: { params: Promise<{ item: string }> }) {
  const session = await auth();
  const { item } = await params;
  const post = await getPost(item);
  
  if (!post) {
    redirect("/posts");
  }

  const isAuthor = session?.user?.email === post?.author?.email;
  const readTime = calculateReadTime(post.content as string);

  return (
    <Box 
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors duration-200"
    >
      <Container size="3">
        <Card 
          size="2" 
          variant="ghost"
          my={{ initial: "1", md: "8" }}
          className=" dark:bg-transparent border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl"
        >
          <Flex gap={{ initial: "4", sm: "8" }} direction={{ initial: "column", md: "row" }} align="start">
            
            {/* Left Column: Author Avatar */}
            <Box className="hidden! md:flex! shrink-0 place-content-center rounded-full border-2 border-(--iris-6) p-1">
              <Image
                src="/images/kubuka-logo.png"
                alt={formatName(post?.author?.name ?? "User")}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </Box>

            {/* Right Column: Article Content */}
            <Flex direction="column" className="w-full">
              
              {/* Top Bar: Status & Actions */}
              <Flex gap="3" align="center" wrap="wrap" mb="4">
                <Badge 
                  color={post.published ? "green" : "orange"} 
                  size="2" 
                  variant="soft"
                >
                  {post.published ? "Published" : "Draft"}
                </Badge>
                
                {isAuthor && (
                  <Button size="1" color="iris" variant="soft" asChild className="cursor-pointer dark:bg-amber-200/30!">
                    <Link href={`/posts/${post.id}`} className="dark:text-orange-300!">
                      Edit Post
                    </Link>
                  </Button>
                )}
              </Flex>

              {/* Title */}
              <Heading as="h1" size="7" weight="bold" className="text-zinc-900 dark:text-zinc-400 mb-6">
                {post.title}
              </Heading>

              {/* Footer Metadata */}
              <Flex 
                align="center" 
                gap="3" 
                mt="1" 
                pt="1" 
                wrap="wrap"
                className="border-t border-zinc-200 dark:border-zinc-800"
              >
                {/* Read Time */}
                <Flex align="center" gap="1" className="text-zinc-500 dark:text-zinc-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Text size="2" weight="medium" className="text-orange-500/50">{readTime}</Text>
                </Flex>

                <Text className="hidden sm:block text-zinc-300 dark:text-zinc-700" aria-hidden="true">
                  ·
                </Text>

                {/* Author Info */}
                <Text size="2" className="text-zinc-500 dark:text-zinc-400">
                  <span className="text-indigo-500">Featuring —</span>{" "}
                  <Link 
                    href={`/authors/${post.authorId}`} 
                    className="text-zinc-700 dark:text-zinc-500 font-medium hover:text-(--iris-11) dark:hover:text-(--iris-11) hover:underline transition-colors"
                  > 
                    {formatName(post.author.name ?? "User")}
                  </Link>
                </Text>
              </Flex>

              {/* Lexical Editor Viewer */}
              {/* Note: Wrapped in a prose div to ensure internal Lexical tags inherit good typography styles if needed */}
              <Box className="max-w-none" mt="6">
                <ClientViewer content={post.content as string} />
              </Box>

            </Flex>
          </Flex>
        </Card>
      </Container>
    </Box>
  );
}