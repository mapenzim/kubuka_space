"use client";

import { useCallback, useState } from "react";

import {
  Box,
  Button,
  Flex,
} from "@radix-ui/themes";

import FormLexicalEditor from "../FormLexicalEditor";

interface ConversationComposerProps {
  placeholder: string;
  disabled?: boolean;
  onSend: (content: string) => Promise<void> | void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

export default function ConversationComposer({
  placeholder,
  disabled = false,
  onSend,
  onTypingStart,
  onTypingStop,
}: ConversationComposerProps) {
  //--------------------------------------------------------
  // State
  //--------------------------------------------------------

  const [value, setValue] =
    useState("");

  const [clearSignal, setClearSignal] =
    useState(0);

  //--------------------------------------------------------
  // Editor
  //--------------------------------------------------------

  const handleChange =
    useCallback(
      (content: string) => {
        setValue(content);

        if (content.trim()) {
          onTypingStart?.();
        } else {
          onTypingStop?.();
        }
      },
      [
        onTypingStart,
        onTypingStop,
      ],
    );

  //--------------------------------------------------------
  // Submit
  //--------------------------------------------------------

  const handleSubmit =
    useCallback(
      async (
        event: React.FormEvent<HTMLFormElement>,
      ) => {
        event.preventDefault();

        const content =
          value.trim();

        if (
          disabled ||
          !content
        ) {
          return;
        }

        await onSend(content);

        onTypingStop?.();

        setValue("");

        setClearSignal(
          (previous) =>
            previous + 1,
        );
      },
      [
        disabled,
        value,
        onSend,
        onTypingStop,
      ],
    );

  //--------------------------------------------------------
  // Render
  //--------------------------------------------------------

  return (
    <Box className="p-4">
      <form
        onSubmit={handleSubmit}
      >
        <Flex
          gap="3"
          align="end"
        >
          <Box className="flex-1">
            <FormLexicalEditor
              value={value}
              onChange={
                handleChange
              }
              placeholder={
                placeholder
              }
              minHeight="4rem"
              disabled={
                disabled
              }
              clearSignal={
                clearSignal
              }
            />
          </Box>

          <Button
            type="submit"
            loading={disabled}
            disabled={
              disabled ||
              !value.trim()
            }
          >
            Send
          </Button>
        </Flex>
      </form>
    </Box>
  );
}