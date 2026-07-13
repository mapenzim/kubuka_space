"use client";

import UserChat from "@/components/chat/userSSE";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Link,
  Section,
  Separator,
  Text,
} from "@radix-ui/themes";

import { useSession } from "next-auth/react";

export default function ContactUsPage() {
  const { data: session } =
    useSession();

  return (
    <Container
      size="4"
      px="4"
      mt={{
        initial: "4",
        md: "8",
      }}
      pb="8"
      className="dark:bg-zinc-950"
    >
      <Section size="4">
        <Grid
          columns={{
            initial: "1",
            md: "2",
          }}
          gap="6"
          align="start"
        >
          {/* ===================================== */}
          {/* CHAT */}
          {/* ===================================== */}

          <UserChat
            user={
              session?.user
                ? {
                    id: session.user.id,
                    name: session.user.name ?? null,
                    email: session.user.email ?? null,
                  }
                : null
            }
          />

          {/* ===================================== */}
          {/* CONTACT INFO */}
          {/* ===================================== */}

          <Flex
            direction="column"
            gap="6"
            pl={{
              initial: "0",
              md: "6",
            }}
          >
            <Box>
              <Heading
                as="h3"
                size="5"
                mb="3"
              >
                Contact Information
              </Heading>

              <Flex
                direction="column"
                gap="3"
              >
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
              <Heading
                as="h3"
                size="5"
                mb="3"
              >
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