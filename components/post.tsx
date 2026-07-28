"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

import { publishPost, saveDraft } from "@/app/actions/postActions.server";
import LexicalEditor from "./lexical-editor/editor";

import {
  Button,
  Flex,
  Text,
  Box,
  Heading,
  Card,
} from "@radix-ui/themes";
import Form from "next/form";

function SubmitButton({
  isPublished,
  postId,
  content,
}: {
  isPublished?: boolean;
  postId?: string;
  content: string;
}) {
  const { pending } = useFormStatus();
  const { data: session } = useSession();
  const router = useRouter();

  const handleDraft = async (formData: FormData) => {
    formData.set("content", content);
    const res = await saveDraft(formData);

    if ("error" in res) {
      toast.error(res.error.message);
      return;
    }

    toast.success("Draft saved successfully.");
    if (postId) {
      router.push(`/posts/${postId}/read`);
    } else {
      router.push(`/authors/${session?.user.id}`);
    }
  };

  return (
    <Flex gap="3">
      <Button
        type="submit"
        disabled={pending}
        color="blue"
        variant="solid"
      >
        {isPublished ? "Update Post" : "Publish Post"}
      </Button>
      {!isPublished && (
        <Button
          formAction={handleDraft}
          disabled={pending}
          color="gray"
          variant="soft"
        >
          Save as Draft
        </Button>
      )}
    </Flex>
  );
}

interface PostFormProps {
  post: {
    content: string | null;
    id: string;
    title: string;
    published: boolean;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } | null;
}

export function PostForm({ post }: PostFormProps) {
  const [content, setContent] = useState(post?.content || "");
  const contentRef = useRef(content);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (formData: FormData) => {
    formData.set("content", contentRef.current);
    const res = await publishPost(formData);

    if ("error" in res) {
      toast.error(res.error.message);
      return;
    }

    toast.success("Post saved successfully.");
    if (post?.id) {
      router.push(`/posts/${post.id}/read`);
    } else {
      router.push("/posts");
    }
  };

  const isPublished = post?.published;

  if (post && session?.user.id !== post.authorId) {
    toast.error("You don't have permission to edit this post.");
    router.push("/posts");
    return null;
  }

  return (
    <Box 
      className="w-full flex flex-col items-center justify-center min-h-screen px-4"
      my="8"
    >
      <Box className="max-w-2xl mx-auto px-4">
        <Flex justify="between" align="center" mb="6">
          <Heading size="6" className="text-zinc-700 dark:text-zinc-300">
            {!post ? "Create New Post" : "Edit Post"}
          </Heading>
          {!!post && (
            <Button
              variant="ghost"
              color="gray"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          )}
        </Flex>
      </Box>

      <Card 
        className="flex w-full max-w-2xl" 
        variant="ghost" 
        style={{ padding: "2rem", marginInline: "auto" }}
      >
        <Form action={handleSubmit}>
          {post && <input type="hidden" name="postId" value={post.id} />}
          {post?.id && (
            <input type="hidden" name="authorId" value={post.authorId} />
          )}

          <Flex direction="column" gap="4">
            <Box>
              <Text as="label" htmlFor="title" size="2" weight="medium" className="dark:text-zinc-400">
                Title
              </Text>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={post?.title}
                placeholder="Enter your post title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none dark:text-zinc-500"
              />
            </Box>

            <Box>
              <Text as="label" htmlFor="content" size="2" weight="medium" className="dark:text-zinc-400">
                Content
              </Text>
              <LexicalEditor
                key={post?.id}
                initialValue={post?.content as string}
                onChange={(val) => {
                  contentRef.current = val;
                  setContent(val);
                }}
              />
            </Box>

            <Flex justify="end" pt="4">
              <SubmitButton
                isPublished={isPublished}
                postId={post?.id}
                content={contentRef.current}
              />
            </Flex>
          </Flex>
        </Form>
      </Card>
    </Box>
  );
}
