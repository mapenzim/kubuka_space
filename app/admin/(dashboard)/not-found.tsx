"use client";

import { Flex, Heading, Text, Button, Box } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      className="min-h-[70vh] text-center px-4"
    >
      {/* Illustration / Icon */}
      <Box mb="5" className="text-(--gray-a8)">
        <svg 
          width="80" 
          height="80" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" x2="12" y1="8" y2="12"/>
          <line x1="12" x2="12.01" y1="16" y2="16"/>
        </svg>
      </Box>

      <Heading as="h1" size="8" mb="2">
        Page Not Found
      </Heading>
      
      <Text as="p" size="4" color="gray" mb="6" className="max-w-md">
        The page or resource you are looking for doesn't exist, has been moved, or you don't have the necessary permissions to view it.
      </Text>

      <Button size="3" color="indigo" asChild style={{ cursor: "pointer" }}>
        <Link href="#" onClick={() => router.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Previous Page
        </Link>
      </Button>
    </Flex>
  );
}