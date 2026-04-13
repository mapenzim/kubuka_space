"use client";

import DOMPurify from "dompurify";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // or atom-one-dark
import marked from "@/lib/markdown";

// Configure marked once
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  })
);

export default function MarkdownViewer({ content }: { content: string }) {
  const rawHtml = marked.parse(content || "");

  const safeHtml = DOMPurify.sanitize(rawHtml as string);

  return (
    <div
      className="
        mt-1 text-sm text-gray-700 dark:text-gray-500
        prose max-w-none
        dark:prose-invert

        prose-pre:bg-gray-900
        prose-pre:text-white
        prose-code:text-pink-400
        prose-p:mb-4
        
        prose-img:rounded-lg
        prose-img:shadow-md
        prose-img:my-8
      "
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}