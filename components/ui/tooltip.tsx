import { Tooltip } from "@radix-ui/themes";
import { ReactNode } from "react";

type TooltipProps = {
  content: string;
  children: ReactNode;
}

export const ToolTip = ({ children, content }: TooltipProps) => {
  return (
    <Tooltip content={content}>
      {children}
    </Tooltip>
  );
};