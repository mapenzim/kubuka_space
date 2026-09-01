"use client";

import { userBio } from "@/app/actions/authActions.server";
import * as Form from "@radix-ui/react-form";
import { Avatar, Box, Button, Flex, Popover, TextArea, Tooltip } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type UserBio = {
  id: string;
  text: string;
  userId: string;
};

type ExistingUserBio = {
  bio: UserBio | null;
  onSaved: (bio: UserBio) => void;
}

export const AddUpdateBioPopover = ({
  bio,
  onSaved,
}: ExistingUserBio) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const addUserBio = async (formData: FormData) => {
    if (saving) return;

    setSaving(true);
    try {
      const result = await userBio(formData);

      if ("error" in result) {
        toast.error(result.error.message);
        return;
      }

      onSaved(result.bio);
      setOpen(false);
      toast.success("Bio saved");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to save your bio.");
    } finally {
      setSaving(false);
    }
  }

  const statement = (word: string) => `${word} Bio statement`;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button variant="ghost" size={"1"}>
          <Tooltip  content={bio?.id ? statement("Update") : statement("Add")}>
            <PlusIcon className="w-4 h-auto text-zinc-800 dark:text-zinc-300" />
          </Tooltip>
        </Button>
      </Popover.Trigger>
      <Popover.Content width={"480px"} side="left">
        <Flex gap={"3"}>
          <Avatar 
            size={"1"}
            src={"/images/avatar.png"}
            fallback="A"
            radius="full"
          />
          <Box flexGrow={"1"}>
            <Form.Root action={addUserBio}>
            <TextArea 
              placeholder="Add your bio" 
              style={{ height: 120 }} 
              name="bio" 
              defaultValue={bio?.text}
              required
            />
            <Flex gap={"3"} mt={"3"} justify={"between"} >
              <Flex align={"center"} gap={"2"} asChild>
                <Form.Submit asChild>
                  <Button type="submit" size="1" loading={saving} disabled={saving}>
                    {!bio?.id ? "Add" : "Update"}
                  </Button>
                </Form.Submit>
              </Flex>
              <Popover.Close>
                <Button size={"1"}>Cancel</Button>
              </Popover.Close>
            </Flex>

            </Form.Root>
          </Box>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
