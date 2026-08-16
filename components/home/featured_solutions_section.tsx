import Link from "next/link";
import MerchandiseCard from "@/components/cart/components/merchandise_card";
import prisma from "@/lib/prisma";

const FeaturedSolutionsSection = async () => {
  let products: {
    id: string;
    title: string;
    body: string;
    price: number;
    stockQuantity: number;
  }[] = [];

  try {
    const merchandise = await prisma.merchandise.findMany({
      where: {
        deletedAt: null,
        stockQuantity: { gt: 0 },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        body: true,
        price: true,
        stockQuantity: true,
      },
    });

    products = merchandise.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  } catch (error) {
    console.error("Unable to load featured solutions.", error);
  }

  return (
    <section
      id="featured-solutions"
      className="relative isolate w-full overflow-hidden bg-linear-to-br from-violet-50 via-indigo-100 to-fuchsia-100 px-4 pt-20 pb-32 text-slate-900 dark:border-t dark:border-gray-700 dark:from-slate-950 dark:via-slate-900 dark:to-zinc-950 dark:text-white lg:pt-28 lg:pb-36"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-30">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-fuchsia-300 blur-3xl dark:bg-fuchsia-500" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-300 blur-3xl dark:bg-indigo-500" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-300">
            Featured solutions
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Solutions built for growing businesses
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-violet-100/75 sm:text-lg">
            Explore practical digital products designed to simplify operations,
            strengthen your online presence, and help your organisation grow.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <MerchandiseCard key={product.id} item={product} />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-violet-200 bg-white/60 p-8 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <h3 className="text-xl font-semibold">Looking for a tailored solution?</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-violet-100/70">
              Tell us what your organisation needs and we will help you identify
              the right product or build a solution around your goals.
            </p>
          </div>
        )}

        <div className="relative z-10 mt-12 flex flex-col items-center justify-center gap-4 pb-2 sm:flex-row">
          <Link
            href="/store"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-violet-700 bg-violet-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-900/20 transition hover:border-violet-800 hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-700 dark:border-white dark:bg-white dark:text-violet-950 dark:shadow-black/20 dark:hover:border-violet-100 dark:hover:bg-violet-100 dark:focus-visible:outline-white"
          >
            Explore all products
          </Link>
          <Link
            href="/contact_us"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-violet-300 bg-white/40 px-6 py-3 text-sm font-semibold text-violet-900 transition hover:border-violet-400 hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-700 dark:border-violet-300/50 dark:bg-transparent dark:text-white dark:hover:border-violet-200 dark:hover:bg-white/10 dark:focus-visible:outline-white"
          >
            Discuss a custom solution
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSolutionsSection;
