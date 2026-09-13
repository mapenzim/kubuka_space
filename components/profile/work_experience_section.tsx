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

function sortExperiences(experiences: UserWorkExperience[]) {
  return [...experiences].sort((left, right) => {
    if (left.isCurrent !== right.isCurrent) {
      return Number(right.isCurrent) - Number(left.isCurrent);
    }

    const leftStart = left.startDate ? new Date(left.startDate).getTime() : 0;
    const rightStart = right.startDate ? new Date(right.startDate).getTime() : 0;
    if (leftStart !== rightStart) return rightStart - leftStart;

    const leftEnd = left.endDate ? new Date(left.endDate).getTime() : 0;
    const rightEnd = right.endDate ? new Date(right.endDate).getTime() : 0;
    return rightEnd - leftEnd;
  });
}

export default function WorkExperienceSection({
  initialExperiences,
}: WorkExperienceSectionProps) {
  const [experiences, setExperiences] = useState(() =>
    sortExperiences(initialExperiences),
  );

  const handleSaved = useCallback((savedExperience: UserWorkExperience) => {
    setExperiences((current) => {
      const updated = current.some((experience) => experience.id === savedExperience.id)
        ? current.map((experience) =>
            experience.id === savedExperience.id ? savedExperience : experience,
          )
        : [...current, savedExperience];

      return sortExperiences(updated);
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
        <Heading as="h3" size="5" className="text-zinc-900 dark:text-zinc-300 uppercase">
          Work Experience
        </Heading>
        <AddUpdateExperiencePopover onSaved={handleSaved} />
      </Flex>

      <Flex direction="column" gap="4" ml="3">
        {experiences.length > 0 ? (
          experiences.map((experience) => (
            <Box
              key={experience.id}
              className="group relative rounded-r-lg border-l-2 border-zinc-200 py-2 pr-2 pl-6 transition-colors hover:bg-zinc-50 focus-within:bg-zinc-50 last:pb-2 dark:border-zinc-800 dark:hover:bg-zinc-800/40 dark:focus-within:bg-zinc-800/40"
            >
              <div className="absolute -left-1.75 top-1.5 size-3 rounded-full bg-(--iris-9) ring-4 ring-white dark:ring-zinc-900" />

              <Flex justify="between" align="start" wrap="wrap" gap="4" mb="2">
                <Box>
                  <Heading as="h4" size="4" className="text-zinc-900 dark:text-zinc-100">
                    {experience.jobTitle}
                  </Heading>
                  <Text size="2" color="gray" weight="bold" className="mt-1 flex items-center gap-2 dark:text-zinc-400!">
                    {experience.companyName} <span>•</span> {experience.dates}
                  </Text>
                </Box>

                <Flex
                  gap="2"
                  className="opacity-100 transition-opacity sm:pointer-events-none sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100 sm:group-focus-within:pointer-events-auto sm:group-focus-within:opacity-100"
                >
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
            className="rounded-lg border border-dashed border-zinc-200 p-6 text-center italic dark:border-zinc-700 dark:text-zinc-400!"
          >
            No work experience added yet.
          </Text>
        )}
      </Flex>
    </Box>
  );
}
