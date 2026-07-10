"use client";

import { deletePost } from "@/app/actions/postActions.server";
import { DropdownMenu } from "@radix-ui/themes";
import RemoveAlert from "../modals/alert";

export const DeletePost = ({ postId, path}: { postId: string; path: string; }) => {

  const makeDelete = async () => {
    await deletePost(postId, path);
  }
  return (
    <RemoveAlert
      trigger={
        <DropdownMenu.Item 
          color="ruby"
        >
          Delete Post
        </DropdownMenu.Item>
      }
      title="Permanently delete post"
      description="This action cannot be undone. Are you sure?"
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={makeDelete}
    />
  );
}
