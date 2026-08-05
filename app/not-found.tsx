import Link from "next/link";
import { Box, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { BookOpenIcon, ShoppingBagIcon, FileQuestionIcon } from "lucide-react";

const popular = [
  {
    link: "posts",
    title: "Blog",
    description: "Read our latest articles",
    icon: BookOpenIcon,
    color: "text-teal-500 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-500",
  },
  {
    link: "store",
    title: "Products",
    description: "Browse our exclusive collection",
    icon: ShoppingBagIcon,
    color: "text-teal-500 dark:text-teal-300",
    bgColor: "bg-teal-50 dark:bg-teal-500/20",
  }
];

export default function NotFound() {
  return (
    <Box className="min-h-[80vh] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 pt-24 pb-32 transition-colors duration-200">
      <Container size="2">
        
        {/* ⚠️ 404 Header Area */}
        <Flex direction="column" align="center" className="text-center mb-10">
          <Box className="flex items-center justify-center align-middle p-4 rounded-full bg-orange-100 dark:bg-orange-500/10 mb-6">
            <FileQuestionIcon className="w-8 h-8 text-orange-500" />
          </Box>
          <Heading as="h1" size="3" weight="bold" className="text-orange-500 uppercase tracking-widest mb-4">
            404 Error
          </Heading>
          <Heading as="h2" size="8" weight="bold" className="text-zinc-900 dark:text-zinc-400 mb-4 tracking-tight">
            Page not found
          </Heading>
          <Text size="3" color="gray" className="max-w-md mx-auto dark:text-zinc-500!">
            Check the URL again, or maybe come back later.
          </Text>
        </Flex>

        {/* 🧭 Helpful Navigation Card */}
        <Card size="4" className="border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none max-w-lg mx-auto rounded-2xl">
          <Heading as="h3" size="2" weight="bold" color="gray" mb="4" className="uppercase tracking-wider">
            Popular Pages
          </Heading>
          
          <Flex direction="column" gap="2">
            {popular.map((ln) => {
              const Icon = ln.icon;
              return (
                <Link key={ln.link} href={`/${ln.link}`} className="group outline-none block">
                  <Flex align="center" gap="4" p="3" className="rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
                    <Box className={`shrink-0 p-3 flex items-center justify-center rounded-lg ${ln.bgColor}`}>
                       <Icon className={`w-5 h-5 ${ln.color}`} />
                    </Box>
                    <Box>
                      <Text as="div" size="3" weight="bold" className="group-hover:text-(--iris-12) transition-colors">
                        {ln.title}
                      </Text>
                      <Text as="div" size="2" color="gray">
                        {ln.description}
                      </Text>
                    </Box>
                  </Flex>
                </Link>
              );
            })}
          </Flex>

          {/* A normal link keeps the not-found route server-rendered and always usable. */}
          <Box mt="6" pt="6" className="border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/"
              className="w-full cursor-pointer bg-linear-to-r from-indigo-500 via-blue-500 to-purple-500 hover:from-indigo-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold border-0 shadow-md hover:shadow-lg transition-all"
              style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0.75rem 1rem", borderRadius: "0.375rem" }}
            >
              Return home
            </Link>
          </Box>
        </Card>

      </Container>
    </Box>
  );
}
