"use client";

import { useState } from "react";

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
import editortheme from "./editorTheme";

type Props = {
  initialValue?: string;
  onChange: (value: string) => void;
};

export default function LexicalEditor({
  initialValue,
  onChange,
}: Props) {
  const [initialState] = useState(initialValue);

  const initialConfig = {
    namespace: "kubuka-space-editor",
    theme: editortheme,
    onError(error: Error) {
      console.error(error);
    },
    nodes: [ HeadingNode, ListNode, ListItemNode, LinkNode, QuoteNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex w-full flex-col overflow-hidden rounded-none border border-black/10 dark:border-white/10 dark:bg-stone-800">
        <ToolbarPlugin />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="h-64 overflow-y-auto p-2 text-base dark:text-zinc-300 leading-relaxed outline-none"
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

      <InitialStatePlugin initialValue={initialState} />

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
