"use client";

import { useEffect, useRef, useState } from "react";
import {
  Container,
  Heading,
  Text,
  Section,
  Grid,
  Flex,
  Box,
  Link,
  Separator,
} from "@radix-ui/themes";

import { getThreadById } from "@/app/actions/messageThreadAction";
import { UIThread } from "@/lib/interfaces";
import { toUIThread } from "@/hooks/sse";
import UserChat from "@/components/chat/userSSE";
import { useSession } from "next-auth/react";

// ======================================================
// COMPONENT
// ======================================================
export default function ContactUsPage() {
  const [thread, setThread] = useState<UIThread | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const userId = session?.user?.email || session?.user?.name || "anonymous";
  const role = "user";

  // Initial load of thread
  useEffect(() => {
    async function init() {
      const res = await getThreadById(userId);
      if (res.success && res.thread) {
        setThread(toUIThread(res.thread));
      }
    }
    init();
  }, [userId]);

  // Auto scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [thread?.messages.length]);

  return (
    <Container
      size="4"
      px="4"
      mt={{ initial: "4", md: "8" }}
      pb="8"
      className="dark:bg-zinc-950"
    >
      <Section size="3">
        <UserChat userId={userId} sender={session?.user.name as string} email={session?.user.email as string} />

        <Grid
          columns={{ initial: "1", md: "2" }}
          gap="6"
          align="start"
        >
          {/* ========================================= */}
          {/* RIGHT */}
          {/* ========================================= */}

          <Flex
            direction="column"
            gap="6"
            pl={{ initial: "0", md: "6" }}
          >
            <Box>
              <Heading as="h3" size="5" mb="3">
                Contact Information
              </Heading>

              <Flex direction="column" gap="3">
                <Text size="3">
                  +263 (0) 77 715 1673
                </Text>

                <Link
                  href="mailto:mudimbam@outlook.com"
                  size="3"
                >
                  mudimbam@outlook.com
                </Link>
              </Flex>
            </Box>

            <Separator size="4" />

            <Box>
              <Heading as="h3" size="5" mb="3">
                Our Office
              </Heading>

              <Text size="3">
                Kubuka Headquarters
                <br />
                Kasambabezi
                <br />
                Binga, Zimbabwe
              </Text>
            </Box>
          </Flex>
        </Grid>
      </Section>
    </Container>
  );
}