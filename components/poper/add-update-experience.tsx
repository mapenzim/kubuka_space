import { Avatar, Box, Button, Checkbox, Flex, Popover, Text, TextArea } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";

export const AddUpdateExperiencePopover = () => {
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
            <TextArea placeholder="Add your bio" style={{ height: 120 }} />
            <Flex gap={"3"} mt={"3"} justify={"between"} >
              <Flex align={"center"} gap={"2"} asChild>
                <Text as="label" size="2">
                  <Checkbox />
                  <Text>Terms and conditions apply.</Text>
                </Text>
              </Flex>
              <Popover.Close>
                <Button size={"1"}>Add</Button>
              </Popover.Close>
            </Flex>
          </Box>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}