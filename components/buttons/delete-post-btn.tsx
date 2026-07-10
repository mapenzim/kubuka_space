"use client";

import { useState } from "react";
import { DropdownMenu } from "@radix-ui/themes";
import { deletePost } from "@/app/actions/postActions.server";
import RemoveItemAlert from "../modals/admin-delete-alert";

export const DeletePost = ({
  postId,
  path,
}: {
  postId: string;
  path: string;
}) => {
  const [open, setOpen] = useState(false);

  const makeDelete = async () => {
    await deletePost(postId, path);
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu.Item
        color="ruby"
        onSelect={(e) => {
          e.preventDefault(); // Prevent the default select behavior
          setOpen(true);
        }}
      >
        Delete Post
      </DropdownMenu.Item>

      <RemoveItemAlert
        open={open}
        onOpenChange={setOpen}
        title="Permanently delete post"
        description="This action cannot be undone. Are you sure?"
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={makeDelete}
      />
    </>
  );
};