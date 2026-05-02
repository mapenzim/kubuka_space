"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useEffect, useRef } from "react";

// ✨ Import the same nodes you use in the editor
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

// ✨ 1. Upgraded to the bulletproof hydration logic
function LoadContent({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current && content && content.trim() !== "") {
      try {
        // Note: Lexical's parseEditorState can take the string directly, no need for JSON.parse()
        const parsedState = editor.parseEditorState(content);

        let isStateEmpty = false;
        parsedState.read(() => {
          const root = $getRoot();
          if (root.getChildrenSize() === 0) {
            isStateEmpty = true;
          }
        });

        if (isStateEmpty) {
          throw new Error("Parsed state resulted in an empty root.");
        }

        editor.setEditorState(parsedState);
      } catch (error) {
        console.warn("Viewer hydration failed. Injecting safe fallback.", error);
        editor.update(() => {
          const root = $getRoot();
          //if (root.getChildrenSize() === 0) {
          //  root.append($createParagraphNode());
          //}
          root.clear(); 

          // Clear any default nodes
          const p = $createParagraphNode();

          // Wrap the raw string in a Lexical TextNode
          p.append($createTextNode(content)); 
                    
          root.append(p);
        });
      }
      isInitialized.current = true;
    }
  }, [content, editor]);

  return null;
}

export function PostViewer({ content }: { content: string }) {// ✨ 2. Add the same theme used in your editor to retain styles
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
    list: {
      ul: "list-disc ml-6",
      ol: "list-decimal ml-6",
    },
  };

  const config = {
    namespace: "Viewer",
    editable: false, // 👈 important
    theme, // 👈 ensures it actually looks like the post they created
    onError: (e: Error) => console.error(e),
    // ✨ 3. MUST register the same nodes, or they will be deleted on load
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode], 
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="prose dark:prose-invert dark:text-zinc-400">
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <LoadContent content={content} />
      </div>
    </LexicalComposer>
  );
}