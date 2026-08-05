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
import UserChat from "@/components/chat/UserChat";
import { auth } from "@/auth";
import ContactReadMarker from "@/components/chat/ContactReadMarker";

export default async function ContactUsPage() {
  const session = await auth();

  // Extract user safely for cleaner rendering
  const userData = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
      }
    : null;

  return (
    <Container
      size="4"
      px="4"
      mt={{ initial: "2", md: "8" }}
      pb="8"
      className="min-h-[calc(100vh-4rem)] bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100"
    >
      <ContactReadMarker userId={session?.user?.id ?? null} />
      <Section size="4">
        <Grid
          columns={{ initial: "1", md: "2" }}
          gap="6"
          align="start"
        >
          {/* Chat Section */}
          <UserChat user={userData} />

          {/* Contact Information Section */}
          <Flex
            direction="column"
            gap="6"
            pl={{ initial: "0", md: "6" }}
            className="text-zinc-900 dark:text-zinc-100"
          >
            <Box>
              <Heading as="h3" size="5" mb="3" className="text-zinc-900 dark:text-zinc-100">
                Contact Information
              </Heading>
              <Flex direction="column" gap="3">
                <Text size="3" className="text-zinc-700 dark:text-zinc-300">
                  +263 (0) 77 715 1673
                </Text>
                <Link
                  href="mailto:mudimbam@outlook.com"
                  size="3"
                  className="text-indigo-700 dark:text-indigo-300"
                >
                  mudimbam@outlook.com
                </Link>
              </Flex>
            </Box>

            <Separator size="4" />

            <Box>
              <Heading as="h3" size="5" mb="3" className="text-zinc-900 dark:text-zinc-100">
                Our Office
              </Heading>
              <Text size="3" className="text-zinc-700 dark:text-zinc-300">
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
