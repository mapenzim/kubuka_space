"use client";

import dynamic from "next/dynamic";

// 1. We do the dynamic import HERE, inside a Client Component
const PostViewer = dynamic(
  () => import("./viewer").then((mod) => mod.PostViewer),
  { 
    ssr: false,
    loading: () => <div className="mt-4 h-32 w-full animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
  }
);

// 2. We export a simple wrapper that accepts the content prop
export function ClientViewer({ content }: { content: string }) {
  return <PostViewer content={content} />;
}