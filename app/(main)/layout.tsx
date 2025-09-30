import { ReactNode } from "react";

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params}) {
  const { slug } = await params;
  return slug;
}

export default async function Layout({
  children,
  params
}: Readonly<{ children: ReactNode, params: Params }>){
  const { slug } = await params;
  return (
    <div className="flex w-full min-h-screen items-start justify-center mt-8 md:mt-16">
      {children || slug}
    </div>
  );
}
