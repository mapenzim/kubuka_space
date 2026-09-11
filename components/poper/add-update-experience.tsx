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
import { useState } from "react";
import { toast } from "sonner";

export type UserWorkExperience = {
  id: string;
  jobTitle: string;
  companyName: string;
  dates: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  duties: string;
  userId: string;
};

type WorkExperienceProps = {
  workExperience?: UserWorkExperience;
  onSaved: (experience: UserWorkExperience) => void;
}

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const;

function toMonthParts(value: string | null | undefined) {
  if (!value) return { month: "", year: "" };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { month: "", year: "" };

  return {
    month: String(date.getUTCMonth() + 1),
    year: String(date.getUTCFullYear()),
  };
}

export const AddUpdateExperiencePopover = ({ workExperience, onSaved }: WorkExperienceProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCurrent, setIsCurrent] = useState(workExperience?.isCurrent ?? false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const userExperienceAction = async (formData: FormData) => {
    if (saving) return;

    setSaving(true);
    try {
      const result = await userWorkExperience(formData);

      if ("error" in result) {
        setSubmitError(result.error.message);
        return;
      }

      onSaved(result.experience);
      setSubmitError(null);
      setOpen(false);
      toast.success("Work experience saved");
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to save work experience.",
      );
    } finally {
      setSaving(false);
    }
  }

  const statement = (word: string) => `${word} work experience`;
  const startDate = toMonthParts(workExperience?.startDate);
  const endDate = toMonthParts(workExperience?.endDate);
  const dateFieldClassName = "h-8 min-w-0 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:[color-scheme:dark] dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400";

  return (
    <Popover.Root open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      if (nextOpen) {
        setSubmitError(null);
        setIsCurrent(workExperience?.isCurrent ?? false);
      }
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
      <Popover.Content
        width={"640px"}
        side="left"
        className="bg-white! text-zinc-900! shadow-xl dark:bg-zinc-900! dark:text-zinc-100!"
      >
        <Flex gap={"3"}>
          <Avatar 
            size={"1"}
            src={"/images/avatar.png"}
            fallback="A"
            radius="full"
          />
          <Box flexGrow={"1"}>
            <Form.Root action={userExperienceAction}>
              <input type="hidden" name="experienceId" value={workExperience?.id ?? ""} />
              <input type="hidden" name="isCurrent" value={isCurrent ? "true" : "false"} />
              <Flex direction={"column"} gapY={"3"} gap={"3"} mb={"3"} >
                <TextField.Root 
                  placeholder="Job Title" 
                  size={"1"}
                  name="jobTitle"
                  defaultValue={workExperience?.jobTitle}
                  required
                  className="dark:bg-zinc-950! dark:text-zinc-100!"
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
                  className="dark:bg-zinc-950! dark:text-zinc-100!"
                >
                  <TextField.Slot>
                    <FactoryIcon height={"16"} width={"16"} />
                  </TextField.Slot>
                </TextField.Root>
                <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
                  <Box className="flex flex-1 flex-col gap-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    <span className="flex items-center gap-1.5">
                      <CalendarRangeIcon aria-hidden="true" className="size-4 text-zinc-500 dark:text-zinc-400" />
                      From
                    </span>
                    <span className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
                      <select
                        name="startMonth"
                        aria-label="From month"
                        defaultValue={startDate.month}
                        required
                        className={dateFieldClassName}
                      >
                        <option value="">Month</option>
                        {MONTHS.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="startYear"
                        aria-label="From year"
                        placeholder="Year"
                        min="1900"
                        max="2100"
                        inputMode="numeric"
                        defaultValue={startDate.year}
                        required
                        className={dateFieldClassName}
                      />
                    </span>
                  </Box>

                  <Box className="flex flex-1 flex-col gap-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    <span className="flex items-center gap-1.5">
                      <CalendarRangeIcon aria-hidden="true" className="size-4 text-zinc-500 dark:text-zinc-400" />
                      To
                    </span>
                    <span className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
                      <select
                        name="endMonth"
                        aria-label="To month"
                        defaultValue={endDate.month}
                        disabled={isCurrent}
                        required={!isCurrent}
                        className={dateFieldClassName}
                      >
                        <option value="">Month</option>
                        {MONTHS.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="endYear"
                        aria-label="To year"
                        placeholder="Year"
                        min="1900"
                        max="2100"
                        inputMode="numeric"
                        defaultValue={endDate.year}
                        disabled={isCurrent}
                        required={!isCurrent}
                        className={dateFieldClassName}
                      />
                    </span>
                  </Box>
                </Flex>

                <Text as="label" size="2" className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                  <Checkbox
                    checked={isCurrent}
                    onCheckedChange={(checked) => setIsCurrent(checked === true)}
                  />
                  I currently work here (Present)
                </Text>
              </Flex>
              <TextArea 
                name="duties"
                placeholder="Duties" 
                style={{ height: 120 }} 
                defaultValue={workExperience?.duties}
                required
                className="dark:bg-zinc-950! dark:text-zinc-100! dark:placeholder:text-zinc-500!"
              />
              {submitError && (
                <Text size="1" color="red" mt="2">
                  {submitError}
                </Text>
              )}
              <Flex gap={"3"} mt={"3"} justify={"end"} >
                <Form.Submit asChild>
                  <Button 
                    size={"1"}
                    type="submit"
                    loading={saving}
                    disabled={saving}
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
