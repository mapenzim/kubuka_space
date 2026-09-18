"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { Button, Dialog, Flex, IconButton, Popover, Text, TextArea, TextField } from "@radix-ui/themes";
import { Check, ChevronDown, Code2, Palette, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createSnippetRequest, getSnippetEntitlements } from "@/app/actions/snippetActions.server";
import { humanizeSnippetValue, SnippetCategoryValue } from "@/lib/snippets";

type Entitlement = Awaited<ReturnType<typeof getSnippetEntitlements>>[number];

const COLOR_OPTIONS = [
  { label: "Indigo", value: "#4f46e5" },
  { label: "Blue", value: "#2563eb" },
  { label: "Cyan", value: "#0891b2" },
  { label: "Green", value: "#16a34a" },
  { label: "Amber", value: "#d97706" },
  { label: "Red", value: "#dc2626" },
  { label: "Rose", value: "#e11d48" },
  { label: "Purple", value: "#9333ea" },
  { label: "Slate", value: "#475569" },
  { label: "Black", value: "#18181b" },
  { label: "White", value: "#ffffff" },
  { label: "Soft gray", value: "#f4f4f5" },
] as const;

function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const customColor = /^#[0-9a-f]{6}$/i.test(value) ? value : "#4f46e5";

  function chooseColor(color: string) {
    onChange(color);
    setPickerOpen(false);
  }

  return (
    <div className="grid min-w-0 flex-1 gap-1">
      <Text as="label" size="2" weight="medium">{label}</Text>
      <Popover.Root open={pickerOpen} onOpenChange={setPickerOpen}>
        <Popover.Trigger>
          <button
            type="button"
            className="flex h-10 w-full items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-left text-sm text-zinc-900 outline-none transition hover:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            aria-label={`${label}: ${value || "Developer choice"}`}
          >
            {value ? (
              <span
                aria-hidden="true"
                className="h-5 w-5 shrink-0 rounded-full border border-black/20 shadow-sm dark:border-white/30"
                style={{ backgroundColor: value }}
              />
            ) : (
              <Palette aria-hidden="true" size={19} className="shrink-0 text-zinc-500" />
            )}
            <span className="min-w-0 flex-1 truncate">{value || "Developer choice"}</span>
            <ChevronDown aria-hidden="true" size={16} className="shrink-0 text-zinc-500" />
          </button>
        </Popover.Trigger>
        <Popover.Content
          width="300px"
          align="start"
          className="bg-white! text-zinc-900! shadow-xl dark:bg-zinc-900! dark:text-zinc-100!"
        >
          <Flex justify="between" align="center" gap="3" mb="3">
            <Text size="2" weight="bold">Choose {label.toLowerCase()}</Text>
            <Button type="button" size="1" variant="soft" color="gray" onClick={() => chooseColor("")}>Developer choice</Button>
          </Flex>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                title={`${option.label} (${option.value})`}
                aria-label={`Choose ${option.label} ${option.value}`}
                aria-pressed={value.toLowerCase() === option.value}
                onClick={() => chooseColor(option.value)}
                className="relative aspect-square rounded-full border border-black/20 shadow-sm transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-white/30 dark:focus-visible:ring-offset-zinc-900"
                style={{ backgroundColor: option.value }}
              >
                {value.toLowerCase() === option.value && (
                  <Check
                    aria-hidden="true"
                    size={16}
                    className={option.value === "#ffffff" || option.value === "#f4f4f5" ? "absolute inset-0 m-auto text-zinc-900" : "absolute inset-0 m-auto text-white"}
                  />
                )}
              </button>
            ))}
          </div>
          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-md border border-zinc-200 p-2 text-sm dark:border-zinc-700">
            <span>
              <Text as="span" size="2" weight="medium">Custom colour</Text>
              <Text as="span" size="1" color="gray" className="ml-2 font-mono">{customColor}</Text>
            </span>
            <input
              type="color"
              aria-label={`Choose a custom ${label.toLowerCase()}`}
              value={customColor}
              onChange={(event) => onChange(event.target.value)}
              className="h-8 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}

export default function SnippetRequestDialog({
  threadId,
  initialRemainingCount,
}: {
  threadId: string;
  initialRemainingCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [orderItemId, setOrderItemId] = useState("");
  const [category, setCategory] = useState<SnippetCategoryValue | "">("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [fontFamily, setFontFamily] = useState("");
  const [appearance, setAppearance] = useState("");
  const [responsive, setResponsive] = useState(true);
  const [instructions, setInstructions] = useState("");
  const [remainingCount, setRemainingCount] = useState(initialRemainingCount);

  const selected = useMemo(
    () => entitlements.find((item) => item.orderItemId === orderItemId),
    [entitlements, orderItemId],
  );
  const selectedCategory = selected && category && selected.categories.includes(category)
    ? category
    : selected?.categories[0] ?? "";
  async function refreshEntitlements(showLoading: boolean, showError: boolean) {
    if (showLoading) setLoading(true);
    try {
      const items = await getSnippetEntitlements();
      setEntitlements(items);
      setRemainingCount(items.reduce((total, item) => total + item.remaining, 0));
      setOrderItemId((current) =>
        items.some((item) => item.orderItemId === current)
          ? current
          : items[0]?.orderItemId ?? ""
      );
    } catch {
      if (showError) toast.error("Unable to check your snippet purchases.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) return;
    void refreshEntitlements(true, true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !selectedCategory) return;
    startTransition(async () => {
      try {
        await createSnippetRequest({
          threadId,
          orderItemId: selected.orderItemId,
          category: selectedCategory,
          primaryColor,
          textColor,
          backgroundColor,
          fontFamily,
          appearance,
          responsive,
          instructions,
        });
        setEntitlements((current) => current.map((item) =>
          item.orderItemId === selected.orderItemId
            ? { ...item, remaining: Math.max(0, item.remaining - 1) }
            : item
        ));
        setRemainingCount((current) => Math.max(0, current - 1));
        toast.success("Snippet request sent to the developer.");
        setOpen(false);
        setInstructions("");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to create the request.");
      }
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Trigger>
        <IconButton
          type="button"
          variant="soft"
          color="indigo"
          radius="full"
          size="4"
          title="Request a purchased code snippet"
          aria-label={`Request a purchased code snippet${remainingCount ? `, ${remainingCount} credit${remainingCount === 1 ? "" : "s"} available` : ""}`}
        >
          <span className="relative grid size-8 place-items-center">
            <Code2 size={32} />
            {remainingCount > 0 && (
              <span className="absolute -right-3 -top-3 grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-zinc-900">
                {remainingCount > 99 ? "99+" : remainingCount}
              </span>
            )}
          </span>
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="620px" className="bg-white! text-zinc-900 dark:bg-zinc-900! dark:text-zinc-100">
        <Dialog.Title>Request a code snippet</Dialog.Title>
        <Dialog.Description size="2" color="gray">Use one purchased snippet credit and tell the developer what to prepare.</Dialog.Description>

        {loading ? (
          <Text as="p" mt="4" color="gray">Checking your snippet purchases…</Text>
        ) : entitlements.length === 0 ? (
          <Flex direction="column" align="center" gap="3" className="mt-5 rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
            <ShoppingBag size={26} className="text-indigo-500" />
            <Text weight="bold">You do not have an unused snippet purchase.</Text>
            <Text size="2" color="gray">Buy an HTML, React, or Python snippet from the store, then return here to submit its requirements.</Text>
            <Button asChild><Link href="/store?category=code-snippets">Browse snippet products</Link></Button>
          </Flex>
        ) : (
          <form onSubmit={submit} className="mt-5">
            <Flex direction="column" gap="4">
              <label className="grid gap-1 text-sm font-medium">Purchased product
                <select value={orderItemId} onChange={(event) => { setOrderItemId(event.target.value); setCategory(""); }} className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                  {entitlements.map((item) => <option key={item.orderItemId} value={item.orderItemId}>{item.title} · {humanizeSnippetValue(item.language)} · {item.remaining} remaining</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium">Component type
                <select value={selectedCategory} onChange={(event) => setCategory(event.target.value as SnippetCategoryValue)} className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                  {selected?.categories.map((item) => <option key={item} value={item}>{humanizeSnippetValue(item)}</option>)}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <ColorPickerField label="Primary colour" value={primaryColor} onChange={setPrimaryColor} />
                <ColorPickerField label="Text colour" value={textColor} onChange={setTextColor} />
                <ColorPickerField label="Background colour" value={backgroundColor} onChange={setBackgroundColor} />
                <label className="grid gap-1 text-sm font-medium">Font
                  <TextField.Root placeholder="Developer choice, e.g. Inter" value={fontFamily} onChange={(event) => setFontFamily(event.target.value)} />
                </label>
              </div>
              <label className="grid gap-1 text-sm font-medium">Appearance
                <select value={appearance} onChange={(event) => setAppearance(event.target.value)} className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                  <option value="">Developer choice</option><option value="light">Light</option><option value="dark">Dark</option><option value="both">Light and dark</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={responsive} onChange={(event) => setResponsive(event.target.checked)} />Make it responsive</label>
              <label className="grid gap-1 text-sm font-medium">Additional instructions
                <TextArea rows={5} maxLength={2000} placeholder="Describe the content, layout, interactions, or Python behaviour you need." value={instructions} onChange={(event) => setInstructions(event.target.value)} />
              </label>
              <Flex justify="end" gap="2">
                <Button type="button" variant="soft" color="gray" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending || !selectedCategory}>{isPending ? "Sending…" : "Send request"}</Button>
              </Flex>
            </Flex>
          </form>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
