"use client";

import { userBio } from "@/app/actions/authActions.server";
import * as Form from "@radix-ui/react-form";
import { Avatar, Box, Button, Flex, Popover, Text, TextArea } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";

type ExistingUserBio = {
  bio: {
    id: string;
    text: string;
    userId: string;
  } | null;
}

export const AddUpdateBioPopover = ({
  bio
}: ExistingUserBio) => {
  const { data: session, update } = useSession();
  const user = session?.user;

  const addUserBio = async (formData: FormData) => {
    await userBio(formData);
    await update({
    bio: {
        text: formData.get("bio") as string,
      },
    });
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" size={"1"}>
          <PlusIcon className="w-4 h-auto text-zinc-400" />
        </Button>
      </Popover.Trigger>
      <Popover.Content width={"360px"}>
        <Flex gap={"3"}>
          <Avatar 
            size={"1"}
            src={"/images/avatar.png"}
            fallback="A"
            radius="full"
          />
          <Box flexGrow={"1"}>
            <Form.Root action={addUserBio}>
              <input type="hidden" name="userId" value={user?.id} />
              <input type="hidden" name="bioId" value={ bio?.userId ?? "" } />
              
            <TextArea 
              placeholder="Add your bio" 
              style={{ height: 120 }} 
              name="bio" 
              defaultValue={bio?.text}
            />
            <Flex gap={"3"} mt={"3"} justify={"between"} >
              <Flex align={"center"} gap={"2"} asChild>
              <Form.Submit asChild>
                <Button type="submit" size="1">
                  Add
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