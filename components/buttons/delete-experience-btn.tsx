"use client";

import { deleteUserWorkExperience } from "@/app/actions/authActions.server";
import { Tooltip } from "@radix-ui/themes";
import { ArchiveIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RemoveAlert from "../modals/alert";

export const DeleteUserExperience = ({ id }: {  id: string }) => {
  const { update } = useSession();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await deleteUserWorkExperience(id);
    await update();
    router.refresh();
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
