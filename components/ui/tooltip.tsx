import { IconButton, Tooltip } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";

export const ToolTip = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tooltip content="Add to library">
      <IconButton radius="full">
        <PlusIcon />
      </IconButton>
    </Tooltip>
  );
};