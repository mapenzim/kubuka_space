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
    <Card>
      <Heading mb="4">Start Conversation</Heading>

      <form onSubmit={onSubmit}> 
        <Flex direction="column" gap="4">

          {!user && (
            <>
              <Box>
                <Text>Full Name</Text>

                <TextField.Root
                  value={guestName}
                  onChange={(e) => onGuestNameChange(e.target.value)}
                  required
                />
              </Box>

              <Box>
                <Text>Email</Text>

                <TextField.Root
                  type="email"
                  value={guestEmail}
                  onChange={(e) => onGuestEmailChange(e.target.value)}
                  required
                />
              </Box>
            </>
          )}

          {user && (
            <Box>
              <Text size="2">Signed in as</Text>

              <Text weight="bold">
                {user.name}
              </Text>

              <Text color="gray">
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
          >
            Start Conversation
          </Button>

          {!!error && (
            <Text color="red">
              {error}
            </Text>
          )}

        </Flex>
      </form>
    </Card>
  );
}