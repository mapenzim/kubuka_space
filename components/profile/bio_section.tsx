"use client";

import { useCallback, useState } from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";

import {
  AddUpdateBioPopover,
  UserBio,
} from "@/components/poper/add-update-bio";

interface BioSectionProps {
  initialBio: UserBio | null;
}

export default function BioSection({ initialBio }: BioSectionProps) {
  const [bio, setBio] = useState(initialBio);
  const handleSaved = useCallback((savedBio: UserBio) => {
    setBio(savedBio);
  }, []);

  return (
    <Box>
      <Flex align="center" justify="between" mb="3">
        <Heading as="h3" size="5" className="text-zinc-900 dark:text-zinc-300">
          About Me
        </Heading>
        <AddUpdateBioPopover bio={bio} onSaved={handleSaved} />
      </Flex>

      <Text as="div" size="3" className="leading-relaxed text-zinc-600 dark:text-zinc-400">
        {bio?.text ? (
          <span className="whitespace-pre-wrap">{bio.text}</span>
        ) : (
          <Text
            size="2"
            color="gray"
            className="block rounded-lg border border-dashed border-zinc-200 p-4 text-center italic dark:border-zinc-700 dark:text-zinc-500!"
          >
            Add something about yourself...
          </Text>
        )}
      </Text>
    </Box>
  );
}
