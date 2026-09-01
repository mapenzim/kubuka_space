"use client";

import { useCallback, useState } from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";

import { DeleteUserExperience } from "@/components/buttons/delete-experience-btn";
import {
  AddUpdateExperiencePopover,
  UserWorkExperience,
} from "@/components/poper/add-update-experience";

interface WorkExperienceSectionProps {
  initialExperiences: UserWorkExperience[];
}

export default function WorkExperienceSection({
  initialExperiences,
}: WorkExperienceSectionProps) {
  const [experiences, setExperiences] = useState(initialExperiences);

  const handleSaved = useCallback((savedExperience: UserWorkExperience) => {
    setExperiences((current) => {
      if (!current.some((experience) => experience.id === savedExperience.id)) {
        return [...current, savedExperience];
      }

      return current.map((experience) =>
        experience.id === savedExperience.id ? savedExperience : experience,
      );
    });
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setExperiences((current) =>
      current.filter((experience) => experience.id !== id),
    );
  }, []);

  return (
    <Box>
      <Flex align="center" justify="between" mb="5">
        <Heading as="h3" size="5" className="text-zinc-900 dark:text-zinc-300">
          Work Experience
        </Heading>
        <AddUpdateExperiencePopover onSaved={handleSaved} />
      </Flex>

      <Flex direction="column" gap="4" ml="3">
        {experiences.length > 0 ? (
          experiences.map((experience) => (
            <Box
              key={experience.id}
              className="relative border-l-2 border-zinc-200 pb-2 pl-6 last:pb-0 dark:border-zinc-800"
            >
              <div className="absolute -left-1.75 top-1.5 size-3 rounded-full bg-(--iris-9) ring-4 ring-white dark:ring-zinc-900" />

              <Flex justify="between" align="start" wrap="wrap" gap="4" mb="2">
                <Box>
                  <Heading as="h4" size="4" className="text-zinc-900 dark:text-zinc-100">
                    {experience.jobTitle}
                  </Heading>
                  <Text size="2" color="gray" weight="bold" className="mt-1 flex items-center gap-2">
                    {experience.companyName} <span>•</span> {experience.dates}
                  </Text>
                </Box>

                <Flex gap="4">
                  <AddUpdateExperiencePopover
                    workExperience={experience}
                    onSaved={handleSaved}
                  />
                  <DeleteUserExperience id={experience.id} onDeleted={handleDeleted} />
                </Flex>
              </Flex>

              <Text as="p" size="2" className="mt-2 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                {experience.duties}
              </Text>
            </Box>
          ))
        ) : (
          <Text
            size="2"
            color="gray"
            className="rounded-lg border border-dashed border-zinc-200 p-6 text-center italic dark:border-zinc-700 dark:text-zinc-600!"
          >
            No work experience added yet.
          </Text>
        )}
      </Flex>
    </Box>
  );
}
