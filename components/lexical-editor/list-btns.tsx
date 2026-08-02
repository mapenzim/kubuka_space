import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { useEffect, useState } from "react";
import { ListIcon, ListOrderedIcon } from "lucide-react";

export function ListButtons() {
  const [editor] = useLexicalComposerContext();
  const [activeListType, setActiveListType] = useState<null | "ul" | "ol">(null);

  useEffect(() => {
    const updateListState = () => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        setActiveListType(null);
        return;
      }

      const anchorNode = selection.anchor.getNode();
      const listNode = $isListNode(anchorNode)
        ? anchorNode
        : $findMatchingParent(anchorNode, (node) => $isListNode(node));
      setActiveListType(
        listNode?.getTag() === "ol"
          ? "ol"
          : listNode?.getTag() === "ul"
            ? "ul"
            : null,
      );
    };

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateListState);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(updateListState);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  const btnBase = "group flex cursor-pointer items-center justify-center rounded-md border-0 p-1.5 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500";
  const btnInactive = "bg-transparent text-zinc-700 hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700";
  const btnActive = "bg-zinc-500 text-white dark:bg-zinc-600";

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
        aria-pressed={activeListType === "ul"}
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
        aria-pressed={activeListType === "ol"}
      >
        <ListOrderedIcon className="w-4 h-4" />
      </button>
    </>
  );
}
