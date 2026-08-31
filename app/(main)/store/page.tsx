import MerchandiseCard from "@/components/cart/components/merchandise_card";
import prisma from "@/lib/prisma";
import { PackageOpen } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Page = async ({ searchParams }: { searchParams: Promise<{ category?: string }> }) => {
  const category = (await searchParams).category?.trim().toLowerCase();
  const merchandise = await prisma.merchandise.findMany({
    where: { deletedAt: null, ...(category ? { category: { slug: category, isActive: true } } : {}) },
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.productCategory.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  const selectedCategory = category
    ? categories.find((item) => item.slug === category)
    : undefined;
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

      {minifiedMerchandise.length > 0 ? (
        <div className="grid gap-y-4 md:my-16 md:grid-cols-3 md:gap-x-16 md:gap-y-8 md:px-16">
          {minifiedMerchandise.map((item) => (
            <MerchandiseCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      ) : (
        <section className="mx-auto my-8 flex min-h-80 w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/80 px-6 py-14 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60">
          <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <PackageOpen aria-hidden="true" size={30} />
          </span>

          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {selectedCategory
              ? `No ${selectedCategory.name} products yet`
              : category
                ? "Category not found"
                : "New products are on the way"}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {selectedCategory
              ? "We’re preparing new solutions for this category. In the meantime, explore the rest of our catalogue or discuss a custom solution with us."
              : category
                ? "This category may have been moved or is no longer available. Browse our current catalogue to find another solution."
                : "Our catalogue is being prepared. Tell us what your organisation needs and we can build a solution around it."}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {category && (
              <Link
                href="/store"
                className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Browse all products
              </Link>
            )}

            <Link
              href="/contact_us"
              className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Discuss a custom solution
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Page;
