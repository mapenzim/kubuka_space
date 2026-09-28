"use client";

import { useState } from "react";
import { DropdownMenu } from "@radix-ui/themes";
import { archivePost, deletePost } from "@/app/actions/postActions.server";
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

export const ArchivePost = ({
  postId,
  path,
}: {
  postId: string;
  path: string;
}) => {
  const [open, setOpen] = useState(false);

  const makeArchive = async () => {
    await archivePost(postId, path);
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu.Item
        color="orange"
        onSelect={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        Archive Post
      </DropdownMenu.Item>
      <RemoveItemAlert
        open={open}
        onOpenChange={setOpen}
        title="Archive post"
        description="The post will be removed from public and active blog lists."
        confirmText="Archive"
        cancelText="Cancel"
        onConfirm={makeArchive}
      />
    </>
  );
};
