import { getPost } from "@/app/actions/postActions.server";
import { auth } from "@/auth";
import { PostForm } from "@/components/post";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ item: string }>; 
}

export default async function ItemPage({ params }: Props) {
  const session = await auth();
  const { item } = await params;
  const post = await getPost(item);

  if (!session) {
    redirect("/authentication");
  }

  switch (item) {
    case post?.id:
      return <PostForm post={post} />;
    case "new":
      return <PostForm post={null} />;
    default:
      redirect('/authentication');
  };
}
