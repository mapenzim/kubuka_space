"use client";

import { userBio } from "@/app/actions/authActions.server";
import * as Form from "@radix-ui/react-form";
import { Avatar, Box, Button, Flex, Popover, Text, TextArea, Tooltip } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const addUserBio = async (formData: FormData) => {
    await userBio(formData);
    await update({
    bio: {
        text: formData.get("bio") as string,
      },
    });

    router.refresh();
  }

  const statement = (word: string) => `${word} Bio status`;

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" size={"1"}>
          <Tooltip  content={bio?.id ? statement("Update") : statement("Add")}>
            <PlusIcon className="w-4 h-auto text-zinc-800" />
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