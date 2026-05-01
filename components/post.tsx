"use client";

import Form from "next/form";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { publishPost, saveDraft } from "@/app/actions/postActions.server";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import LexicalEditor from "./lexical-editor/editor";

function SubmitButton({ isPublished, postId, content }: { isPublished?: boolean; postId: string; content: string }) {
  const { pending } = useFormStatus();
  const { data: session } = useSession();

  const handleDraft = async (formData: FormData) => {
    formData.set("content", content);
    const res = await saveDraft(formData);

    if ("error" in res) {
      toast.error(res.error.message);
      return;
    }

    toast.success("The draft was saved successfully.");

    if (postId) {
      redirect(`/posts/${postId}/read`);
    }

    redirect(`/authors/${session?.user.id}`);
  };
 
  return (
    <div className="flex gap-4">
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        {isPublished ? "Update Post" : "Publish Post"}
      </button>
      {!isPublished && (
        <button
          formAction={handleDraft}
          disabled={pending}
          className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Save as Draft
        </button>
      )}
    </div>
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
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (formData: FormData) => {
    //formData.set("content", content); // ✅ always fresh state
    const res = await publishPost(formData);

    if ( "error" in res) {
      toast.error(res.error.message);
    }

    toast.success("The post was saved successfully.");

    if (post?.id) return redirect(`/posts/${post?.id}/read`);

    return redirect("/posts");
  };

  const isPublished = post?.published;

  if (
    post && session?.user.id !== post?.authorId 
  ) { 
    toast.error("You don't have permission to edit this post.");
    redirect("/posts")
  }

  return (
    <div className="min-h-screen py-14 px-4">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {!post ? "Create New Post" : "Edit Post"}
          </h1>
          {!!post && (
            <Link
              href={`#`}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              onClick={() => router.back()}
            >
              Cancel
            </Link>
          )}
        </div>
      </div>
      <div className="rounded-xl shadow-sm border border-gray-100 p-4">
        <Form action={handleSubmit} className="space-y-6">
          {post && <input type="hidden" name="postId" value={post.id} />}
          <input type="hidden" name="content" value={content} />
          
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={post?.title}
              placeholder="Enter your post title"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <LexicalEditor key={post?.id} initialValue={post?.content as string} onChange={setContent} />
          </div>
          <div className="flex justify-end pt-4">
            <SubmitButton isPublished={isPublished} postId={post?.id as string} content={content} />
          </div>
        </Form>
      </div>
    </div>
  );
}
