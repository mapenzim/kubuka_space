"use client";

import {
  Check,
  Code2,
  MonitorSmartphone,
  Package,
  PlugZap,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import Loading from "@/components/loading";
import { useCart } from "@/context/cartContext";
import { getDiscountedUnitPrice, getProductDiscount } from "@/lib/pricing";

type SnippetLanguage = "HTML" | "REACT" | "PYTHON";

export interface StoreMerchandiseItem {
  id: string;
  title: string;
  body: string;
  price: number;
  stockQuantity: number;
  category: { name: string; slug: string } | null;
  snippetProduct: {
    language: SnippetLanguage;
    categories: string[];
  } | null;
}

type Props = { item: StoreMerchandiseItem };

function humanize(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");
}

function SnippetVisual({ item }: { item: StoreMerchandiseItem }) {
  const language = item.snippetProduct?.language ?? "HTML";
  const component = humanize(item.snippetProduct?.categories[0] ?? "component");
  const lines = language === "REACT"
    ? [
        `export function ${component.replaceAll(" ", "")}() {`,
        "  return (",
        `    <${component.toLowerCase()}>`,
        "      Your content",
        `    </${component.toLowerCase()}>`,
        "  );",
        "}",
      ]
    : language === "PYTHON"
      ? [
          `def build_${component.toLowerCase().replaceAll(" ", "_")}():`,
          "    data = prepare_data()",
          "    return render(data)",
        ]
      : [
          `<!-- ${component} -->`,
          `<${component.toLowerCase()}>`,
          "  <div class=\"content\">",
          "    Your content",
          "  </div>",
          `</${component.toLowerCase()}>`,
        ];

  return (
    <div className="relative h-44 overflow-hidden bg-linear-to-br from-zinc-950 via-slate-950 to-indigo-950 p-4 text-zinc-100">
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-indigo-500/25 blur-2xl" />
      <div className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl">
        <div className="flex h-8 items-center justify-between border-b border-white/10 bg-white/5 px-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-rose-400" />
            <span className="size-2 rounded-full bg-amber-300" />
            <span className="size-2 rounded-full bg-emerald-400" />
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-indigo-200">
            <Code2 size={12} />{language}
          </span>
        </div>
        <div className="space-y-1 px-3 py-2 font-mono text-[9px] leading-3.5">
          {lines.map((line, index) => (
            <div key={`${line}-${index}`} className={index % 3 === 0 ? "text-fuchsia-300" : index % 2 === 0 ? "text-cyan-200" : "text-zinc-300"}>
              <span className="mr-3 inline-block w-3 text-right text-zinc-600">{index + 1}</span>{line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceVisual() {
  return (
    <div className="relative h-44 overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white">
      <div className="absolute -left-8 bottom-0 size-32 rounded-full bg-cyan-300/30 blur-2xl" />
      <div className="absolute -right-6 -top-8 size-36 rounded-full bg-pink-300/30 blur-2xl" />
      <div className="relative flex h-full items-center justify-center" aria-hidden="true">
        <div className="absolute left-3 top-5 h-24 w-36 -rotate-6 rounded-xl border border-white/30 bg-white/15 shadow-2xl backdrop-blur-sm" />
        <div className="absolute right-3 top-2 h-28 w-40 rotate-4 rounded-xl border border-white/30 bg-slate-950/30 shadow-2xl backdrop-blur-sm">
          <div className="flex gap-1.5 border-b border-white/15 px-3 py-2">
            <span className="size-2 rounded-full bg-white/60" />
            <span className="size-2 rounded-full bg-white/35" />
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            <span className="col-span-2 h-3 rounded bg-white/70" />
            <span className="h-3 rounded bg-fuchsia-200/70" />
            <span className="col-span-3 h-12 rounded bg-white/15" />
          </div>
        </div>
        <span className="absolute bottom-1 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-2xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-md">
          <MonitorSmartphone size={25} />
        </span>
      </div>
    </div>
  );
}

function ElectricalVisual() {
  return (
    <div className="relative h-44 overflow-hidden bg-linear-to-br from-amber-300 via-orange-400 to-rose-500 p-5 text-zinc-950">
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/20 to-transparent" />
      <div className="relative flex h-full items-center justify-center" aria-hidden="true">
        <span className="absolute size-28 rounded-full border border-white/40 bg-white/25 shadow-2xl backdrop-blur-md" />
        <span className="absolute size-20 rounded-full border border-white/50 bg-white/40" />
        <PlugZap size={46} strokeWidth={1.6} className="relative drop-shadow-md" />
        <svg viewBox="0 0 240 40" className="absolute inset-x-0 bottom-0 w-full text-white/70" fill="none" aria-hidden="true">
          <path d="M0 22h35l10-15 18 27 14-20 12 8h32l9-13 18 26 16-21 10 8h66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function DefaultVisual({ category }: { category: string }) {
  return (
    <div className="relative h-44 overflow-hidden bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-600 p-5 text-white">
      <div className="absolute -right-10 -top-10 size-40 rounded-full border-20 border-white/10" />
      <div className="relative flex h-full flex-col items-center justify-center gap-3" aria-hidden="true">
        <span className="grid size-16 place-items-center rounded-2xl border border-white/25 bg-white/20 shadow-xl backdrop-blur-md">
          <Package size={34} strokeWidth={1.6} />
        </span>
        <span className="rounded-full border border-white/25 bg-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
          {category}
        </span>
      </div>
    </div>
  );
}

function ProductVisual({ item }: { item: StoreMerchandiseItem }) {
  if (item.snippetProduct) return <SnippetVisual item={item} />;
  if (item.category?.slug === "digital-services") return <ServiceVisual />;
  if (item.category?.slug === "electrical") return <ElectricalVisual />;
  return <DefaultVisual category={item.category?.name ?? "Product"} />;
}

export default function MerchandiseCard({ item }: Props) {
  const { cartLoading, addItem } = useCart();
  const discount = getProductDiscount(item.price);
  const discountedPrice = getDiscountedUnitPrice(item.price);
  const highlights = item.body.split(",").map((part) => part.trim()).filter(Boolean);
  const hasFeatureList = !item.snippetProduct && highlights.length > 1;
  const categoryName = item.category?.name ?? "Product";
  const availableLabel = item.snippetProduct
    ? `${item.stockQuantity} request credit${item.stockQuantity === 1 ? "" : "s"}`
    : `${item.stockQuantity} available`;

  return (
    <article className="group flex min-h-[31rem] flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white text-zinc-950 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-950/10 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-indigo-400/50 dark:hover:shadow-black/30">
      <ProductVisual item={item} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
            {item.snippetProduct ? <Code2 size={12} /> : <Sparkles size={12} />}
            {item.snippetProduct?.language ?? categoryName}
          </span>
          <span className={`size-2.5 rounded-full ${item.stockQuantity > 0 ? "bg-emerald-500" : "bg-rose-500"}`} aria-hidden="true" />
        </div>

        <h3 className="mt-4 text-xl font-semibold capitalize tracking-tight">{item.title}</h3>

        {item.snippetProduct ? (
          <>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.snippetProduct.categories.map((category) => (
                <span key={category} className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {humanize(category)}
                </span>
              ))}
            </div>
          </>
        ) : hasFeatureList ? (
          <ul className="mt-4 grid gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            {highlights.slice(0, 5).map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 capitalize">
                <Check size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 line-clamp-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.body}</p>
        )}

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div>
              {discount > 0 && <span className="block text-xs text-zinc-400 line-through">${item.price.toFixed(2)}</span>}
              <span className="text-2xl font-semibold tracking-tight">${discountedPrice.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                Save ${discount.toFixed(2)}
              </span>
            )}
          </div>

          <p className={`mt-2 text-xs font-medium ${item.stockQuantity > 0 ? "text-zinc-500 dark:text-zinc-400" : "text-rose-600 dark:text-rose-400"}`}>
            {item.stockQuantity > 0 ? availableLabel : "Out of stock"}
          </p>

          <button
            type="button"
            disabled={cartLoading || item.stockQuantity < 1}
            className="mt-4 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
            onClick={() => addItem(item)}
          >
            {cartLoading ? (
              <Loading />
            ) : item.stockQuantity > 0 ? (
              <><ShoppingCart size={16} />{item.snippetProduct ? "Add snippet credit" : "Add to cart"}</>
            ) : (
              "Out of stock"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
