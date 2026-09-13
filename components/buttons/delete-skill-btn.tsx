"use client";

import { deleteUserSkill } from "@/app/actions/authActions.server";
import RemoveAlert from "@/components/modals/alert";
import { Tooltip } from "@radix-ui/themes";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

export function DeleteUserSkill({
  id,
  name,
  onDeleted,
}: {
  id: string;
  name: string;
  onDeleted: (id: string) => void;
}) {
  const handleDelete = async () => {
    const result = await deleteUserSkill(id);

    if ("error" in result) {
      toast.error(result.error.message);
      return;
    }

    onDeleted(id);
    toast.success("Skill deleted");
  };

  return (
    <RemoveAlert
      trigger={
        <Tooltip content={`Delete ${name}`}>
          <button
            type="button"
            aria-label={`Delete ${name}`}
            className="inline-flex size-7 items-center justify-center rounded-md text-orange-600 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:hover:bg-red-950/50"
          >
            <Trash2Icon className="size-4" />
          </button>
        </Tooltip>
      }
      title="Delete skill"
      description={`Remove ${name} from your profile? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={handleDelete}
    />
  );
}
