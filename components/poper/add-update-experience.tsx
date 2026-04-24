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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type WorkExperience = {
  workExperience: {
    id: string;
    jobTitle: string;
    companyName: string;
    dates: string;
    duties: string;
    userId: string;
  } | null;
}

export const AddUpdateExperiencePopover = ({ workExperience }: WorkExperience) => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const router = useRouter();

  const userExperienceAction = async (formData: FormData) => {
    await userWorkExperience(formData);
    await update({
      workExperience: {
        jobTitle: formData.get("jobTitle") as string,
        companyName: formData.get("companyName") as string,
        dates: formData.get("dates") as string,
        duties: formData.get("duties") as string,
        userId: formData.get("userId") as string
      },
    });
    router.refresh();
  }

  const statement = (word: string) => `${word} work experience`;

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" size={"1"}>
          <Tooltip content={!workExperience ? statement("Add") : statement("Update")}>
            {!workExperience?.id
              ? <PlusIcon className="w-4 h-auto text-zinc-800" />
              : <FileEditIcon className="w-4 h-auto text-zinc-700" />
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
              <input type="hidden" name="userId" value={user?.id} />
              <input type="hidden" name="workExperienceUserId" value={ workExperience?.userId } />
              <Flex direction={"column"} gapY={"3"} gap={"3"} mb={"3"} >
                <TextField.Root 
                  placeholder="Job Title" 
                  size={"1"}
                  name="jobTitle"
                  defaultValue={workExperience?.jobTitle}
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
              />
              <Flex gap={"3"} mt={"3"} justify={"between"} >
                <Flex align={"center"} gap={"2"} asChild>
                  <Text as="label" size="2">
                    <Checkbox />
                    <Text asChild>Terms and conditions apply.</Text>
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
