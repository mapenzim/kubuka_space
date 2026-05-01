"use client";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";

import { defineExtension, $getRoot, $createParagraphNode } from "lexical";

import { RichTextExtension } from "@lexical/rich-text";
import { HistoryExtension } from "@lexical/history";
import { AutoFocusExtension as AutoFocusExt, TabIndentationExtension } from "@lexical/extension";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { ToolbarPlugin } from "./toolbar";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

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

// ✨ Upgraded Anti-Crash Hydration Plugin
function InitialStatePlugin({ initialValue }: { initialValue?: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only run if we haven't initialized yet, AND if we have an actual string value
    if (!isInitialized.current && initialValue && initialValue.trim() !== "") {
      try {
        const parsedState = editor.parseEditorState(initialValue);

        // 1. Verify the state didn't parse into an empty root
        let isStateEmpty = false;
        parsedState.read(() => {
          const root = $getRoot();
          if (root.getChildrenSize() === 0) {
            isStateEmpty = true;
          }
        });

        // 2. If it's empty, throw to trigger our fallback
        if (isStateEmpty) {
          throw new Error("Parsed state resulted in an empty root.");
        }

        // 3. Apply the valid state
        editor.setEditorState(parsedState);

      } catch (error) {
        console.warn("Lexical hydration failed. Injecting safe fallback state.", error);
        
        // 🚨 FALLBACK: Forcefully create a safe paragraph block to prevent the crash
        editor.update(() => {
          const root = $getRoot();
          if (root.getChildrenSize() === 0) {
            const p = $createParagraphNode();
            root.append(p);
          }
        });
      }
      isInitialized.current = true;
    }
  }, [editor, initialValue]);

  return null;
}

// ✨ Main Editor
export default function LexicalEditor({ initialValue, onChange }: Props) {

  return (
    <LexicalExtensionComposer
      extension={[landingHeroExtension, AutoFocusExt]}
      contentEditable={null}
    >
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-solid border-black/10 dark:border-white/10 dark:bg-stone-800">
        <ToolbarPlugin />
        <div className="relative">
          <ContentEditable
            className="h-55 overflow-y-auto p-4 text-base leading-relaxed text-wrap outline-none"
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

      {/* ✨ ADDED: Listens to state changes and stringifies the JSON for saving */}
      <OnChangePlugin
        onChange={(editorState) => {
          const jsonString = JSON.stringify(editorState.toJSON());
          onChange(jsonString);
        }}
      />

      <InitialStatePlugin initialValue={initialValue} />
    </LexicalExtensionComposer>
  );
}
