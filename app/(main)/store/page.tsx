import MerchandiseCard from "@/components/cart/components/merchandise_card";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Page = async ({ searchParams }: { searchParams: Promise<{ category?: string }> }) => {
  const category = (await searchParams).category?.trim().toLowerCase();
  const merchandise = await prisma.merchandise.findMany({
    where: { deletedAt: null, ...(category ? { category: { slug: category, isActive: true } } : {}) },
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.productCategory.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  const minifiedMerchandise = merchandise.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    price: Number(item.price),
    stockQuantity: item.stockQuantity,
  }));

  // Wrap CartStatus in a client component that listens for updates
  return (
    <div className="flex flex-col w-full px-4 mb-16">
      <nav aria-label="Product categories" className="mx-auto mb-8 flex max-w-6xl flex-wrap justify-center gap-2 pt-8">
        <Link href="/store" className={`rounded-full px-4 py-2 text-sm ${!category ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>All products</Link>
        {categories.map((item) => <Link key={item.id} href={`/store?category=${encodeURIComponent(item.slug)}`} className={`rounded-full px-4 py-2 text-sm ${category === item.slug ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>{item.name}</Link>)}
      </nav>

      <div className="grid md:grid-cols-3 gap-y-4 md:gap-x-16 md:gap-y-8 md:px-16 md:my-16">
        {minifiedMerchandise.map((item) => (
          <MerchandiseCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
