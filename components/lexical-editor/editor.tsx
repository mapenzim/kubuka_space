"use client";

import { useRef } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

import { ToolbarPlugin } from "./toolbar";
import { InitialStatePlugin } from "./initialStatePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

type Props = {
  initialValue?: string;
  onChange: (value: string) => void;
};

const theme = {
  heading: {
    h1: "mb-2 text-3xl font-bold",
    h2: "mb-2 text-2xl font-bold",
    h3: "mb-1 text-xl font-semibold",
    h4: "mb-1 text-lg font-semibold",
    h5: "mb-1 text-md font-semibold",
  },

  paragraph: "my-0",

  quote:
    "my-2 border-l-4 border-zinc-300 pl-4 italic text-zinc-500 dark:border-zinc-600 dark:text-zinc-400",

  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },

  list: {
    ul: "list-disc ml-6 my-3 space-y-1",
    ol: "list-decimal ml-6 my-3 space-y-1",
    listitem: "leading-relaxed",
    nested: {
      list: "mt-1",
    },
  },
};

export default function LexicalEditor({
  initialValue,
  onChange,
}: Props) {
  const initialStateRef = useRef(initialValue);

  const initialConfig = {
    namespace: "kubuka-space-editor",
    theme,
    onError(error: Error) {
      console.error(error);
    },
    nodes: [ HeadingNode, ListNode, ListItemNode, LinkNode, QuoteNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 dark:bg-stone-800">
        <ToolbarPlugin />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-55 overflow-y-auto p-4 text-base leading-relaxed outline-none"
                aria-placeholder="Enter some text..."
                placeholder={
                  <div className="pointer-events-none absolute top-4 left-4 text-zinc-400">
                    Enter some text...
                  </div>
                }
              />
            }
            placeholder={null}
            ErrorBoundary={() => null}
          />
        </div>
      </div>

      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />

      <InitialStatePlugin initialValue={initialStateRef.current} />

      <OnChangePlugin
        onChange={(editorState) => {
          const jsonString = JSON.stringify(
            editorState.toJSON()
          );

          onChange(jsonString);
        }}
      />
    </LexicalComposer>
  );
}