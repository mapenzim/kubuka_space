"use client";

import {
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import {
  RichTextPlugin,
} from "@lexical/react/LexicalRichTextPlugin";
import {
  ContentEditable,
} from "@lexical/react/LexicalContentEditable";
import {
  HistoryPlugin,
} from "@lexical/react/LexicalHistoryPlugin";
import {
  LexicalErrorBoundary,
} from "@lexical/react/LexicalErrorBoundary";
import {
  OnChangePlugin,
} from "@lexical/react/LexicalOnChangePlugin";
import {
  ClearEditorPlugin,
} from "@lexical/react/LexicalClearEditorPlugin";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

const theme = {
  paragraph: "mb-2 text-gray-900 dark:text-zinc-300",
};

function onError(error: Error) {
  console.error(error);
}

type Props = {
  value?: string;
  onChange: (text: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  clearSignal?: number;
};

export default function FormLexicalEditor({
  value = "",
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

  const [shouldClear, setShouldClear] =
    useState(false);

  useEffect(() => {
    if (clearSignal !== undefined) {
      setShouldClear(true);
    }
  }, [clearSignal]);

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
          text-sm
          transition-colors
          focus-within:ring-2
          focus-within:ring-indigo-500
          dark:border-zinc-700
          dark:bg-zinc-900
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
                dark:text-zinc-300
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
              "
            >
              {placeholder}
            </div>
          }
          ErrorBoundary={
            LexicalErrorBoundary
          }
        />

        <HistoryPlugin />

        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const root =
                editorState._nodeMap.get(
                  "root"
                );

              onChange(
                root
                  ? root.getTextContent()
                  : ""
              );
            });
          }}
        />

        {shouldClear && (
          <ClearEditorPlugin />
        )}
      </div>
    </LexicalComposer>
  );
}