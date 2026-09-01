"use client";

import { deleteUserWorkExperience } from "@/app/actions/authActions.server";
import { Tooltip } from "@radix-ui/themes";
import { ArchiveIcon } from "lucide-react";
import { toast } from "sonner";
import RemoveAlert from "../modals/alert";

export const DeleteUserExperience = ({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted: (id: string) => void;
}) => {
  const handleDelete = async (id: string) => {
    const result = await deleteUserWorkExperience(id);

    if ("error" in result) {
      toast.error(result.error.message);
      return;
    }

    onDeleted(id);
    toast.success("Work experience deleted");
  }

  return ( 
    <RemoveAlert
      trigger={
        <button className="text-orange-600 hover:text-red-600">
          <Tooltip content="Delete this entry">
            <ArchiveIcon className="w-4 h-auto" />
          </Tooltip>
        </button>
      }
      title="Delete"
      description="Caution! This action cannot be undone."
      confirmText="Permanent Delete"
      cancelText="Cancel"
      onConfirm={() => handleDelete(id)}
    />
  );
}
