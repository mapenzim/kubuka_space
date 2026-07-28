"use client";

import { Box, Button, Flex } from "@radix-ui/themes";

import FormLexicalEditor from "./FormLexicalEditor";
import { ChatComposerProps } from "@/lib/type_interface";

export default function ChatComposer({
  value,
  loading,
  clearSignal,
  placeholder,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  return (
    <Box className="border-t p-3">
      <form onSubmit={onSubmit}>
        <Flex gap="2" align="end">
          <Box className="flex-1">
            <FormLexicalEditor
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={loading}
              clearSignal={clearSignal}
            />
          </Box>

          <Button
            type="submit"
            loading={loading}
            disabled={!value.trim()}
          >
            Send
          </Button>
        </Flex>
      </form>
    </Box>
  );
}