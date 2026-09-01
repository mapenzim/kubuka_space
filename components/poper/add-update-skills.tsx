"use client";

import { userSkillAction } from "@/app/actions/authActions.server";
import * as Form from "@radix-ui/react-form";
import { Avatar, Box, Button, Checkbox, Flex, Popover, Text, TextField } from "@radix-ui/themes";
import { PlusIcon, TagIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type UserSkill = {
  id: string;
  text: string;
  userId: string;
};

type UserSkillProps = {
  skill: {
    id: string;
    text: string;
    userId: string;
  } | null;
  onSaved: (skill: UserSkill) => void;
}

export const AddUpdateSkillPopover = ({ skill, onSaved }: UserSkillProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleActionSubmit = async (formData: FormData) => {
    if (saving) return;

    setSaving(true);
    try {
      const res = await userSkillAction(formData);

      if ("error" in res) {
        toast.error(res.error.message);
        return;
      }

      onSaved(res.skill);
      setOpen(false);
      toast.success("Skill saved");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error saving skill.")
    } finally {
      setSaving(false);
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button variant="ghost" size={"1"}>
          <PlusIcon className="w-4 h-auto text-zinc-700 dark:text-zinc-400" />
        </Button>
      </Popover.Trigger>
      <Popover.Content width={"520px"} side="right">
        <Flex gap={"3"}>
          <Avatar 
            size={"1"}
            src={"/images/avatar.png"}
            fallback="A"
            radius="full"
          />
          <Box flexGrow={"1"}>
            <Form.Root action={handleActionSubmit}>
              <Flex gap={"1"} justify={"between"} mb={"4"}>
                <Flex align={"center"} gap={"1"} asChild>
                  <Text as="label" size={"1"}>
                    <Text as="span">
                      Skill
                    </Text>
                    <TextField.Root 
                      size={"1"} 
                      className="w-88"
                      name="text"
                      defaultValue={skill?.text}
                      required
                    >
                      <TextField.Slot>
                        <TagIcon width={"16"} height={"16"} />
                      </TextField.Slot>
                    </TextField.Root>
                  </Text>
                </Flex>
                <Form.Submit asChild>
                  <Button size={"1"} type="submit" loading={saving} disabled={saving}>
                    Add
                  </Button> 
                </Form.Submit>
              </Flex>
              <Flex gap={"4"} justify={"start"}>
                <Text as="label" size={"1"}>
                  <Checkbox size={"1"} />
                  <Text size={"1"} ml={"3"}>Terms and conditions apply.</Text>
                </Text>
              </Flex>
            </Form.Root>
          </Box>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
