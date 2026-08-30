"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
} from "lexical";
import { useEffect, useRef } from "react";

import editortheme from "./editorTheme";

function LoadContent({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !content.trim()) return;

    try {
      const parsedState = editor.parseEditorState(content);
      let isStateEmpty = false;

      parsedState.read(() => {
        isStateEmpty = $getRoot().getChildrenSize() === 0;
      });

      if (isStateEmpty) {
        throw new Error("Parsed state resulted in an empty root.");
      }

      editor.setEditorState(parsedState);
    } catch (error) {
      console.warn("Viewer hydration failed. Injecting safe fallback.", error);
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(content));
        root.append(paragraph);
      });
    }

    isInitialized.current = true;
  }, [content, editor]);

  return null;
}

export function PostViewer({ content }: { content: string }) {
  const config = {
    namespace: "Viewer",
    editable: false,
    theme: editortheme,
    onError: (error: Error) => console.error(error),
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="prose dark:prose-invert dark:text-zinc-400">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="text-zinc-600 dark:text-zinc-400" />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LoadContent content={content} />
      </div>
    </LexicalComposer>
  );
}
