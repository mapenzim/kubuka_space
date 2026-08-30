"use client";

import { useEffect, useMemo } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { $getRoot } from "lexical";

const theme = {
  paragraph: "mb-2 text-zinc-800 dark:text-zinc-100",
};

function onError(error: Error) {
  console.error(error);
}

type Props = {
  onChange: (text: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;

  /**
   * Increment this number after a successful submit
   * to clear the editor.
   */
  clearSignal?: number;
};

/**
 * Clears the editor every time clearSignal changes.
 */
function ClearOnSignalPlugin({
  clearSignal,
}: {
  clearSignal?: number;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (clearSignal === undefined) return;

    editor.update(() => {
      $getRoot().clear();
    });
  }, [clearSignal, editor]);

  return null;
}

export default function FormLexicalEditor({
  onChange,
  placeholder = "Write a message...",
  minHeight = "7rem",
  disabled = false,
  clearSignal,
}: Props) {
  const initialConfig = useMemo(
    () => ({
      namespace: crypto.randomUUID(),
      theme,
      onError,
    }),
    []
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={`
          relative
          flex
          w-full
          flex-col
          rounded-xl
          border
          border-zinc-300
          bg-white
          p-3
          text-zinc-800
          text-sm
          transition-colors
          focus-within:ring-2
          focus-within:ring-indigo-500
          dark:border-zinc-700
          dark:bg-zinc-800
          dark:text-zinc-100
          ${
            disabled
              ? "opacity-60 pointer-events-none"
              : ""
          }
        `}
        style={{
          minHeight,
        }}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="
                h-full
                w-full
                flex-1
                outline-none
                text-zinc-800
                dark:text-zinc-100
              "
            />
          }
          placeholder={
            <div
              className="
                pointer-events-none
                absolute
                left-3
                top-3
                text-zinc-400
                dark:text-zinc-500
              "
            >
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />

        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              onChange($getRoot().getTextContent());
            });
          }}
        />

        <ClearOnSignalPlugin
          clearSignal={clearSignal}
        />
      </div>
    </LexicalComposer>
  );
}
