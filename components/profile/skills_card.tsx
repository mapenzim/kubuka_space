"use client";

import { useCallback, useState } from "react";
import { Card, Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";
import { Tag } from "lucide-react";
import { DeleteUserSkill } from "@/components/buttons/delete-skill-btn";

import {
  AddUpdateSkillPopover,
  UserSkill,
} from "@/components/poper/add-update-skills";

interface SkillsCardProps {
  initialSkills: UserSkill[];
}

export default function SkillsCard({ initialSkills }: SkillsCardProps) {
  const [skills, setSkills] = useState(initialSkills);

  const handleSaved = useCallback((savedSkill: UserSkill) => {
    setSkills((current) => {
      const existingIndex = current.findIndex(
        (skill) => skill.id === savedSkill.id,
      );

      if (existingIndex === -1) {
        return [...current, savedSkill];
      }

      return current.map((skill) =>
        skill.id === savedSkill.id ? savedSkill : skill,
      );
    });
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setSkills((current) => current.filter((skill) => skill.id !== id));
  }, []);

  return (
    <Card size="1" variant="ghost" className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Flex align="center" justify="between" mb="4">
        <Heading as="h3" size="4" className="text-zinc-900 dark:text-zinc-100 uppercase">
          Skills
        </Heading>
        <AddUpdateSkillPopover skill={null} onSaved={handleSaved} />
      </Flex>

      <ScrollArea type="auto" scrollbars="vertical" className="max-h-64 pr-3">
        <Flex direction="column" gap="2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <Flex
                key={skill.id}
                align="center"
                justify="between"
                gap="3"
                className="group rounded-lg bg-zinc-100 p-2 transition-colors hover:bg-zinc-200/70 focus-within:bg-zinc-200/70 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:focus-within:bg-zinc-800"
              >
                <Flex align="center" gap="2" className="min-w-0">
                  <Tag className="size-4 shrink-0 text-(--iris-11)" />
                  <Text size="2" weight="medium" truncate className="text-zinc-700 dark:text-zinc-300">
                    {skill.text}
                  </Text>
                </Flex>

                <Flex
                  align="center"
                  gap="1"
                  className="shrink-0 opacity-100 transition-opacity sm:pointer-events-none sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100 sm:group-focus-within:pointer-events-auto sm:group-focus-within:opacity-100"
                >
                  <AddUpdateSkillPopover skill={skill} onSaved={handleSaved} />
                  <DeleteUserSkill
                    id={skill.id}
                    name={skill.text}
                    onDeleted={handleDeleted}
                  />
                </Flex>
              </Flex>
            ))
          ) : (
            <Text
              size="2"
              color="gray"
              className="rounded-lg border border-dashed border-zinc-200 py-4 text-center italic dark:border-zinc-700 dark:text-zinc-400!"
            >
              No skills added yet.
            </Text>
          )}
        </Flex>
      </ScrollArea>
    </Card>
  );
}
