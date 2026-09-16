"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { Button, Dialog, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import { Code2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createSnippetRequest, getSnippetEntitlements } from "@/app/actions/snippetActions.server";
import { humanizeSnippetValue, SnippetCategoryValue } from "@/lib/snippets";

type Entitlement = Awaited<ReturnType<typeof getSnippetEntitlements>>[number];

export default function SnippetRequestDialog({ threadId }: { threadId: string }) {
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

  const selected = useMemo(
    () => entitlements.find((item) => item.orderItemId === orderItemId),
    [entitlements, orderItemId],
  );
  const selectedCategory = selected && category && selected.categories.includes(category)
    ? category
    : selected?.categories[0] ?? "";

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) return;
    setLoading(true);
    void getSnippetEntitlements()
      .then((items) => {
        setEntitlements(items);
        setOrderItemId((current) => current || items[0]?.orderItemId || "");
      })
      .catch(() => toast.error("Unable to check your snippet purchases."))
      .finally(() => setLoading(false));
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
        <Button type="button" variant="soft" color="indigo"><Code2 size={16} />Request purchased snippet</Button>
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
              <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
                <TextField.Root className="flex-1" placeholder="Primary colour, e.g. #4f46e5" value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} />
                <TextField.Root className="flex-1" placeholder="Text colour, e.g. white" value={textColor} onChange={(event) => setTextColor(event.target.value)} />
              </Flex>
              <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
                <TextField.Root className="flex-1" placeholder="Background, e.g. #ffffff" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} />
                <TextField.Root className="flex-1" placeholder="Font, e.g. Inter" value={fontFamily} onChange={(event) => setFontFamily(event.target.value)} />
              </Flex>
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
