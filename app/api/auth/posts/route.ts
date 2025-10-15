import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { title, content, authorId } = await req.json();
  const post = await prisma.post.create({
    data: { title, content, authorId: Number(authorId) },
  });
  return Response.json(post);
}

export async function GET() {
  const posts = await prisma.post.findMany({ include: { author: true } });
  return Response.json(posts);
}
