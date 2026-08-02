"use client";

import { Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import FormLexicalEditor from "./FormLexicalEditor";
import { StartConversationFormProps } from "@/lib/type_interface";

export default function StartConversationForm({
  user,
  guestName,
  guestEmail,
  message,
  error,
  loading,
  onGuestNameChange,
  onGuestEmailChange,
  onMessageChange,
  onSubmit,
}: StartConversationFormProps) {
  return (
    <Card className="contact-chat-surface border border-zinc-200 shadow-sm dark:border-zinc-800">
      <Heading mb="4" className="text-zinc-900 dark:text-zinc-100">
        Start Conversation
      </Heading>

      <form onSubmit={onSubmit}> 
        <Flex direction="column" gap="4">

          {!user && (
            <>
              <Box>
                <Text className="text-zinc-700 dark:text-zinc-300">Full Name</Text>

                <TextField.Root
                  value={guestName}
                  onChange={(e) => onGuestNameChange(e.target.value)}
                  required
                  className="dark:border-zinc-700! dark:bg-zinc-800! dark:text-zinc-100!"
                />
              </Box>

              <Box>
                <Text className="text-zinc-700 dark:text-zinc-300">Email</Text>

                <TextField.Root
                  type="email"
                  value={guestEmail}
                  onChange={(e) => onGuestEmailChange(e.target.value)}
                  required
                  className="dark:border-zinc-700! dark:bg-zinc-800! dark:text-zinc-100!"
                />
              </Box>
            </>
          )}

          {user && (
            <Box>
              <Text size="2" className="text-zinc-600 dark:text-zinc-400">Signed in as</Text>

              <Text weight="bold" className="text-zinc-900 dark:text-zinc-100">
                {user.name}
              </Text>

              <Text className="text-zinc-500 dark:text-zinc-400">
                {user.email}
              </Text>
            </Box>
          )}

          <FormLexicalEditor
            value={message}
            onChange={onMessageChange}
            placeholder="How can we help?"
            disabled={loading}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={!message.trim()}
            color="indigo"
            variant="solid"
            className="contact-start-button w-full"
          >
            Start Conversation
          </Button>

          {!!error && (
            <Text color="red" className="dark:text-red-300">
              {error}
            </Text>
          )}

        </Flex>
      </form>
    </Card>
  );
}
