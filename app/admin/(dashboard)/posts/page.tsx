import { fetchAllPosts } from "@/app/actions/postActions.server";
import { DeletePost } from "@/components/buttons/delete-post-btn";
import { formatDate, generateLexicalExcerpt } from "@/lib/utils";
import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Table, 
  Badge, 
  Box, 
  Card,
  DropdownMenu,
  IconButton,
  Link as RadixLink
} from "@radix-ui/themes";
import Link from "next/link";

export default async function AdminPostsPage() {
  const posts = await fetchAllPosts();

  const formatedPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: generateLexicalExcerpt(post.content || ""),
    author: post.author.name,
    status: post.published ? "Published" : "Draft",
    category: "Uncategorized", // Placeholder, replace with actual category if available
    date: post.createdAt.toISOString(),
  }));

  return (
    <Flex direction="column" gap="5">
      
      {/* Page Header */}
      <Flex justify="between" align="center" wrap="wrap" gap="3">
        <Box>
          <Heading as="h1" size="6" mb="1">All Posts</Heading>
          <Text color="gray" size="2">Manage your blog articles, news, and publications.</Text>
        </Box>
        <Button size="3" color="indigo" style={{ cursor: "pointer" }} asChild>
          <Link href="#">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 5v14"/><path d="M5 12h14"/>
            </svg>
            Create New Post
          </Link>
        </Button>
      </Flex>

      {/* Main Data Table */}
      <Card size="2" variant="surface" className="overflow-hidden bg-sky-950">
        <Box className="overflow-x-auto">
          <Table.Root variant="surface" size="3">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Post Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {formatedPosts.length > 0 ? formatedPosts.map((post) => (
                <Table.Row key={post.id} align="center">
                  
                  {/* Title & Excerpt Column */}
                  <Table.RowHeaderCell className="max-w-72">
                    <Box className="truncate">
                      <RadixLink asChild color="indigo" weight="bold" size="2">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          {post.title}
                        </Link>
                      </RadixLink>
                      <Text as="p" size="1" color="gray" className="truncate mt-1">
                        {post.excerpt}
                      </Text>
                    </Box>
                  </Table.RowHeaderCell>

                  {/* Author Column */}
                  <Table.Cell>
                    <Text size="2">{post.author}</Text>
                  </Table.Cell>

                  {/* Category Column */}
                  <Table.Cell>
                    <Badge color="gray" variant="surface">
                      {post.category}
                    </Badge>
                  </Table.Cell>

                  {/* Status Column */}
                  <Table.Cell>
                    <Badge 
                      color={post.status === "Published" ? "grass" : post.status === "Draft" ? "orange" : "gray"} 
                      variant="soft"
                    >
                      {post.status}
                    </Badge>
                  </Table.Cell>

                  {/* Date Column (Using the Intl formatter inline) */}
                  <Table.Cell>
                    <Text size="2" color="gray">
                      {formatDate(post.date)}
                    </Text>
                  </Table.Cell>

                  {/* Actions Column */}
                  <Table.Cell align="right">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" color="gray" size="2" style={{ cursor: "pointer" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                          </svg>
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content size="2" align="end">
                        <DropdownMenu.Item asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>Edit Post</Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>View Live</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DeletePost path="/admin/posts" postId={post.id} />
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>

                </Table.Row>
              )) : (
                <Table.Row>
                  <Table.Cell colSpan={6} align="center">
                    <Box py="8">
                      <Text size="3" color="indigo" weight="bold">
                        No posts found.
                      </Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card>
      
    </Flex>
  );
}