import { getPost } from "@/app/actions/postActions.server";
import { auth } from "@/auth";
import { PostForm } from "@/components/post";
import { redirect } from "next/navigation";
import { hasPermission, PERMISSIONS } from "@/lib/rbac/policy";

type Props = {
  params: Promise<{ item: string }>; 
}

export default async function ItemPage({ params }: Props) {
  const session = await auth();
  const { item } = await params;
  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.BLOG_CREATE)) {
    redirect("/not-authorized");
  }

  const post = await getPost(item);

  switch (item) {
    case post?.id:
      return <PostForm post={post} />;
    case "new":
      return <PostForm post={null} />;
    default:
      redirect('/authentication');
  };
}
