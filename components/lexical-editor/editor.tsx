"use client";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";

import { defineExtension } from "lexical";

import { RichTextExtension } from "@lexical/rich-text";
import { HistoryExtension } from "@lexical/history";
import { AutoFocusExtension as AutoFocusExt, TabIndentationExtension } from "@lexical/extension";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { ToolbarPlugin } from "./toolbar";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { InitialStatePlugin } from "./initialStatePlugin";
import { useRef } from "react";

type Props = {
  initialValue?: string;
  onChange: (value: string) => void;
};

const theme = {
  heading: {
    h1: 'mb-2 text-3xl font-bold',
    h2: 'mb-2 text-2xl font-bold',
    h3: 'mb-1 text-xl font-semibold',
    h4: 'mb-1 text-lg font-semibold',
    h5: 'mb-1 text-md font-semibold',
  },
  paragraph: 'my-0',
  quote:
    'my-2 border-l-4 [border-left-style:solid] border-zinc-300 pl-4 italic text-zinc-500 dark:border-zinc-600 dark:text-zinc-400',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
};

const landingHeroExtension = defineExtension({
  dependencies: [RichTextExtension, HistoryExtension, TabIndentationExtension],
  name: 'kubuka-space-editor',
  namespace: 'kubuka-space-editor',
  nodes: [ListNode, ListItemNode, LinkNode],
  theme,
});


// ✨ Main Editor
export default function LexicalEditor({ initialValue, onChange }: Props) {
  const initialStateRef = useRef(initialValue);

  return (
    <LexicalExtensionComposer
      extension={[landingHeroExtension, AutoFocusExt]}
      contentEditable={
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-solid border-black/10 dark:border-white/10 dark:bg-stone-800">
        <ToolbarPlugin />
        <div className="relative">
          <ContentEditable
            className="h-56 overflow-y-auto p-4 text-base leading-relaxed text-wrap outline-none"
            aria-label="Rich text editor"
            aria-placeholder="Enter some text..."
            placeholder={
              <div className="pointer-events-none absolute top-4 left-4 text-zinc-400 select-none">
                Enter some text...
              </div>
            }
          />
        </div>
      </div>
      }
    >

      <InitialStatePlugin initialValue={initialStateRef.current} />

      {/* ✨ ADDED: Listens to state changes and stringifies the JSON for saving */}
      <OnChangePlugin
        onChange={(editorState, editor) => {
          //const jsonString = JSON.stringify(editorState.toJSON());
          const jsonString = JSON.stringify(editorState.toJSON());
          onChange(jsonString);
          editor.setEditable(true);
          console.log("editable?", editorState.isEmpty());
        }}
      />

    </LexicalExtensionComposer>
  );
}
