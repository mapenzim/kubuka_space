"use client";

import { userSkillAction } from "@/app/actions/authActions.server";
import * as Form from "@radix-ui/react-form";
import { Avatar, Box, Button, Checkbox, Flex, Popover, Text, TextField } from "@radix-ui/themes";
import { PlusIcon, TagIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type UserSkill = {
  skill: {
    id: string;
    text: string;
    userId: string;
  } | null;
}

export const AddUpdateSkillPopover = ({ skill }: UserSkill) => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleActionSubmit = async (formData: FormData) => {
    try {
      const res = await userSkillAction(formData);

      if ("error" in res) {
        toast.error(res.error.message);
        return;
      }

      await update({
        skill: {
          text: formData.get("text") as string,
          userId: formData.get("userId") as string
        }
      });

      router.refresh();
      toast.success("Skill saved");
    } catch (error: any) {
      toast.error(error?.message || "Error saving skill.")
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" size={"1"}>
          <PlusIcon className="w-4 h-auto text-zinc-700" />
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
              {/** Hidden input to control saving data */}
              <input type="hidden" name="userId" value={user?.id} />
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
                    >
                      <TextField.Slot>
                        <TagIcon width={"16"} height={"16"} />
                      </TextField.Slot>
                    </TextField.Root>
                  </Text>
                </Flex>
                <Form.Submit asChild>
                  <Button size={"1"} type="submit">
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