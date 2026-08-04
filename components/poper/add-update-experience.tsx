"use client";

import { 
  Avatar, 
  Box, 
  Button, 
  Checkbox, 
  Flex, 
  Popover, 
  Text, 
  TextArea,
  TextField,
  Tooltip, 
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { CalendarRangeIcon, CaseUpperIcon, FactoryIcon, FileEditIcon, PlusIcon } from "lucide-react";
import { userWorkExperience } from "@/app/actions/authActions.server";
import { useRouter } from "next/navigation";
import { useState } from "react";

type WorkExperience = {
  workExperience?: {
    id: string;
    jobTitle: string;
    companyName: string;
    dates: string;
    duties: string;
  };
}

export const AddUpdateExperiencePopover = ({ workExperience }: WorkExperience) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const userExperienceAction = async (formData: FormData) => {
    const result = await userWorkExperience(formData);

    if ("error" in result) {
      setSubmitError(result.error.message);
      return;
    }

    setSubmitError(null);
    setOpen(false);
    router.refresh();
  }

  const statement = (word: string) => `${word} work experience`;

  return (
    <Popover.Root open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      if (nextOpen) setSubmitError(null);
    }}>
      <Popover.Trigger>
        <Button variant="ghost" size={"1"}>
          <Tooltip content={!workExperience ? statement("Add") : statement("Update")}>
            {!workExperience?.id
              ? <PlusIcon className="w-4 h-auto text-zinc-800 dark:text-zinc-400" />
              : <FileEditIcon className="w-4 h-auto text-zinc-700 dark:text-zinc-400" />
            }
          </Tooltip>
        </Button>
      </Popover.Trigger>
      <Popover.Content width={"640px"} side="left">
        <Flex gap={"3"}>
          <Avatar 
            size={"1"}
            src={"/images/avatar.png"}
            fallback="A"
            radius="full"
          />
          <Box flexGrow={"1"}>
            <Form.Root action={userExperienceAction}>
              <Flex direction={"column"} gapY={"3"} gap={"3"} mb={"3"} >
                <TextField.Root 
                  placeholder="Job Title" 
                  size={"1"}
                  name="jobTitle"
                  defaultValue={workExperience?.jobTitle}
                  required
                >
                  <TextField.Slot>
                    <CaseUpperIcon height={"16"} width={"16"} />
                  </TextField.Slot>
                </TextField.Root>
                <TextField.Root 
                  placeholder="Company name" 
                  size={"1"}
                  name="companyName"
                  defaultValue={workExperience?.companyName}
                  required
                >
                  <TextField.Slot>
                    <FactoryIcon height={"16"} width={"16"} />
                  </TextField.Slot>
                </TextField.Root>
                <TextField.Root 
                  placeholder="Dates" 
                  size={"1"}
                  name="dates"
                  defaultValue={workExperience?.dates}
                  required
                >
                  <TextField.Slot>
                    <CalendarRangeIcon height={"16"} width={"16"} />
                  </TextField.Slot>
                </TextField.Root>
              </Flex>
              <TextArea 
                name="duties"
                placeholder="Duties" 
                style={{ height: 120 }} 
                defaultValue={workExperience?.duties}
                required
              />
              {submitError && (
                <Text size="1" color="red" mt="2">
                  {submitError}
                </Text>
              )}
              <Flex gap={"3"} mt={"3"} justify={"between"} >
                <Flex align={"center"} gap={"2"} asChild>
                  <Text as="label" size="2">
                    <Checkbox />
                    <Text>Terms and conditions apply.</Text>
                  </Text>
                </Flex>

                <Form.Submit asChild>
                  <Button 
                    size={"1"}
                    type="submit"
                  >
                    {!workExperience?.id ? "Create" : "Update"}
                  </Button>
                </Form.Submit>
              </Flex>
            </Form.Root>
          </Box>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
