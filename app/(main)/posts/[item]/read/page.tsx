import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatName } from "@/lib/utils";
import { getPost } from "@/app/actions/postActions.server";
import { auth } from "@/auth";
import { PostViewer } from "@/components/lexical-editor/viewer";

export const dynamic = "force-dynamic";

export default async function ReadPage({ params }: {params: Promise<{ item: string}>}) {
  const session = await auth();
  const { item } = await params;
  const post = await getPost(item);
  
  if (!post) {
    redirect("/posts");
  }

  const isAuthor = session?.user?.email === post?.author?.email;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <article className="rounded-xl bg-white dark:bg-slate-900 p-4 ring-3 ring-indigo-50 dark:ring-zinc-600 sm:p-6 lg:p-8">
          <div className="flex items-start sm:gap-8">
            <div className="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-indigo-500" aria-hidden="true">
              <Image
                src="/images/kubuka-logo.png"
                alt={formatName(post?.author?.name ?? "User")}
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>

            <div>
              <div className="w-full items-start justify-start space-x-4">
                <strong className="rounded-sm border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white dark:text-zinc-200">
                  {post.published ? "Published" : "Draft"}
                </strong>
                {isAuthor && (
                  <Link
                    href={`/posts/${post.id}`}
                    className="rounded-sm border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-indigo-600"
                  >
                    Edit Post
                  </Link>
                )}
              </div>

              <h3 className="mt-4 text-lg font-medium sm:text-xl dark:text-zinc-300">
                <a href="#" className="hover:underline"> {post.title} </a>
              </h3>

              <PostViewer 
                content={post.content as string}
              />

              <div className="mt-4 sm:flex sm:items-center sm:gap-2">
                <div className="flex items-center gap-1 text-gray-500">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>

                  <p className="text-xs font-medium">48:32 minutes</p>
                </div>

                <span className="hidden sm:block" aria-hidden="true">·</span>

                <p className="mt-2 text-xs font-medium text-gray-500 sm:mt-0">
                  Featuring -{" "}
                  <Link href={`/authors/${post.authorId}`} className="underline hover:text-gray-700"> 
                    {formatName(post.author.name ?? "User")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
