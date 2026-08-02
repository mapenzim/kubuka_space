"use client";

import { confirmAdminAccess } from "@/app/actions/adminReauth.server";
import { Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AdminReauthGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await confirmAdminAccess(password);
      if (!result.success) {
        setError(result.message ?? "Unable to confirm access.");
        return;
      }
      setPassword("");
      router.refresh();
    });
  }

  return <Flex align="center" justify="center" className="min-h-screen w-full bg-sky-950 p-6">
    <Card size="4" className="w-full max-w-md">
      <form onSubmit={submit}>
        <Flex direction="column" gap="4">
          <div><Heading size="6">Confirm administrator access</Heading><Text size="2" color="gray">For your security, confirm your password before opening the admin dashboard.</Text></div>
          <TextField.Root type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Administrator password" autoFocus required />
          {error && <Text size="2" color="red">{error}</Text>}
          <Button type="submit" disabled={pending}>{pending ? "Confirming…" : "Continue to dashboard"}</Button>
        </Flex>
      </form>
    </Card>
  </Flex>;
}
