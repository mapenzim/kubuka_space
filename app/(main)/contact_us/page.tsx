import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Separator,
  Text,
} from "@radix-ui/themes";
import UserChat from "@/components/chat/UserChat";
import { auth } from "@/auth";
import ContactReadMarker from "@/components/chat/ContactReadMarker";
import { getSnippetEntitlements } from "@/app/actions/snippetActions.server";

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
  const snippetEntitlements = userData ? await getSnippetEntitlements() : [];
  const snippetRemainingCount = snippetEntitlements.reduce(
    (total, entitlement) => total + entitlement.remaining,
    0,
  );

  return (
    <Container
      size="4"
      px="4"
      className="min-h-[calc(100dvh-4rem)] bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 md:min-h-dvh"
    >
      <ContactReadMarker userId={session?.user?.id ?? null} />
        <div className="grid grid-cols-1 items-start gap-6 py-3 md:grid-cols-[minmax(0,60%)_minmax(0,30%)] md:justify-between md:pb-3 md:pt-20">
          {/* Chat Section */}
          <div className="h-[calc(100dvh-5.5rem)] min-h-[32rem] md:h-[calc(100dvh-5.75rem)]">
            <UserChat user={userData} snippetRemainingCount={snippetRemainingCount} />
          </div>

          {/* Contact Information Section */}
          <Flex
            direction="column"
            gap="6"
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
        </div>
    </Container>
  );
}
