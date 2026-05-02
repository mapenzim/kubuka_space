import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function InitialStatePlugin({ initialValue }: { initialValue?: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current && initialValue && initialValue.trim() !== "") {
      try {
        // Attempt 1: Try to parse it as a valid Lexical JSON state
        const parsedState = editor.parseEditorState(initialValue);

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
        console.warn("Data is not valid Lexical JSON. Falling back to plain text insertion.");
        
        // ✨ Attempt 2: If it's plain text (or corrupted), manually insert it as a paragraph!
        editor.update(() => {
          const root = $getRoot();
          root.clear(); // Clear any default nodes
          
          const p = $createParagraphNode();
          // Wrap the raw string in a Lexical TextNode
          p.append($createTextNode(initialValue)); 
          
          root.append(p);
        });
      }
      isInitialized.current = true;
    }
  }, [editor, initialValue]);

  return null;
}