import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { ListIcon, ListOrderedIcon } from "lucide-react";

export function ListButtons() {
  const [editor] = useLexicalComposerContext();
  const [activeListType, setActiveListType] = useState<null | "ul" | "ol">(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = editor.getEditorState()._selection;
        if (!selection) {
          setActiveListType(null);
          return;
        }

        const nodes = selection.getNodes();
        const listNode = nodes.find((n) => $isListNode(n));
        if (listNode) {
          setActiveListType(listNode.getTag() === "ol" ? "ol" : "ul");
        } else {
          setActiveListType(null);
        }
      });
    });
  }, [editor]);

  const btnBase = "px-2 py-1 rounded";
  const btnInactive = "bg-gray-100 hover:bg-gray-200";
  const btnActive = "bg-blue-500 text-white";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (activeListType === "ul") {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}
        className={`${btnBase} ${activeListType === "ul" ? btnActive : btnInactive} mr-0.5`}
        aria-label="Bullet List"
      >
        <ListIcon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => {
          if (activeListType === "ol") {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }
        }}
        className={`${btnBase} ${activeListType === "ol" ? btnActive : btnInactive} mr-0.5`}
        aria-label="Numbered List"
      >
        <ListOrderedIcon className="w-4 h-4" />
      </button>
    </>
  );
}
