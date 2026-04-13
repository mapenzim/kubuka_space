
/*"use client";

import { useRef } from "react";
import marked from "@/lib/markdown";
import * as Toggle from "@radix-ui/react-toggle";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 🧠 Insert text at cursor
  const insertText = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = value.slice(start, end);

    const newText =
      value.slice(0, start) +
      before +
      selected +
      after +
      value.slice(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };

  // 🎹 Keyboard handling (better paragraph UX)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          insertText("**");
          break;
        case "i":
          e.preventDefault();
          insertText("*");
          break;
        case "k":
          e.preventDefault();
          insertText("[", "](url)");
          break;
      }
    }

    // ✨ Improve paragraph spacing behavior
    if (e.key === "Enter" && !e.shiftKey) {
      // natural paragraph spacing (Markdown handles it now via config)
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">

      <div className="space-y-2">

        <div className="flex flex-wrap gap-2 border rounded p-2 
          bg-gray-100 border-gray-200
          dark:bg-gray-800 dark:border-gray-700"
        >
          <Toggle.Root asChild>
            <button
              type="button"
              onClick={() => insertText("**")}
              className="editor-btn"
            >
              B
            </button>
          </Toggle.Root>

          <button type="button" onClick={() => insertText("*")} className="editor-btn">
            I
          </button>

          <button type="button" onClick={() => insertText("## ", "")} className="editor-btn">
            H2
          </button>

          <button type="button" onClick={() => insertText("- ", "")} className="editor-btn">
            • List
          </button>

          <button type="button" onClick={() => insertText("`")} className="editor-btn">
            Code
          </button>

          <button
            type="button"
            onClick={() => insertText("![alt text](", ")")}
            className="editor-btn"
          >
            Image
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Write something..."
          className="w-full min-h-50 p-3 border rounded resize-none 
            bg-white text-gray-900 border-gray-300
            focus:outline-none focus:ring-2 focus:ring-indigo-500

            dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
            dark:placeholder-gray-400"
        />
      </div>

      <div className="border rounded p-4 
        bg-gray-50 border-gray-200
        dark:bg-gray-900 dark:border-gray-700"
      >
        <div
          className="
            prose max-w-none
            prose-gray
            dark:prose-white dark:prose-gray-300
            prose-p:mb-4
            prose-img:rounded-lg

            prose-p:mb-4
            prose-img:rounded-lg
            prose-img:shadow-md
            prose-img:my-8
          "
          dangerouslySetInnerHTML={{
            __html: marked.parse(value),
          }}
        />
      </div>
    </div>
  );
}*/

"use client";

import { useRef } from "react";
import marked from "@/lib/markdown";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapText = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = value.slice(start, end);

    const newText =
      value.slice(0, start) +
      before +
      selected +
      after +
      value.slice(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* ✍️ EDITOR */}
      <div className="space-y-2">

        {/* 🎛️ RADIX TOOLBAR */}
        <ToggleGroup.Root
          type="multiple"
          className="flex flex-wrap gap-2 border rounded p-2
          bg-gray-100 border-gray-200
          dark:bg-gray-800 dark:border-gray-700"
        >
          <ToggleGroup.Item
            value="bold"
            onClick={() => wrapText("**")}
            className="px-3 py-1 rounded text-sm font-medium
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
          >
            B
          </ToggleGroup.Item>

          <ToggleGroup.Item
            value="italic"
            onClick={() => wrapText("*")}
            className="px-3 py-1 rounded text-sm
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
          >
            I
          </ToggleGroup.Item>

          <ToggleGroup.Item
            value="h2"
            onClick={() => wrapText("## ", "")}
            className="px-3 py-1 rounded text-sm
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
          >
            H2
          </ToggleGroup.Item>

          <ToggleGroup.Item
            value="list"
            onClick={() => wrapText("- ", "")}
            className="px-3 py-1 rounded text-sm
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
          >
            • List
          </ToggleGroup.Item>

          <ToggleGroup.Item
            value="code"
            onClick={() => wrapText("`")}
            className="px-3 py-1 rounded text-sm
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
          >
            Code
          </ToggleGroup.Item>

          {/* 🖼️ IMAGE */}
          <ToggleGroup.Item
            value="image"
            onClick={() => wrapText("![alt](", ")")}
            className="px-3 py-1 rounded text-sm
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
          >
            Image
          </ToggleGroup.Item>
        </ToggleGroup.Root>

        {/* 📝 TEXTAREA */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          placeholder="Write something..."
          className="w-full min-h-50 p-3 border rounded resize-none
            bg-white text-gray-900 border-gray-300
            focus:outline-none focus:ring-2 focus:ring-indigo-500

            dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
            dark:placeholder-gray-400"
        />
      </div>

      {/* 👀 PREVIEW */}
      <div className="border rounded p-4
        bg-gray-50 border-gray-200
        dark:bg-gray-900 dark:border-gray-700"
      >
        <div
          className="
            prose max-w-none
            prose-gray
            dark:prose-invert
            prose-p:mb-4
            prose-img:rounded-lg
            prose-img:shadow-md
          "
          dangerouslySetInnerHTML={{
            __html: marked.parse(value),
          }}
        />
      </div>
    </div>
  );
}