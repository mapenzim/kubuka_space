"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Check, Copy, Download, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { humanizeSnippetValue, SnippetFile } from "@/lib/snippets";

interface Delivery {
  requestId: string;
  language: string;
  category: string;
  title: string;
  description: string;
  files: SnippetFile[];
  dependencies: string[];
  usageInstructions: string;
  version: number;
  deliveredAt: string | null;
}

export default function SnippetDeliveryCard({ requestId }: { requestId: string }) {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [error, setError] = useState("");
  const [activePath, setActivePath] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch(`/api/snippets/deliveries/${encodeURIComponent(requestId)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Unable to load the snippet.");
        if (active) {
          setDelivery(payload);
          setActivePath(payload.files?.[0]?.path ?? "");
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load the snippet.");
      });
    return () => { active = false; };
  }, [requestId]);

  const activeFile = useMemo(
    () => delivery?.files.find((file) => file.path === activePath) ?? delivery?.files[0],
    [activePath, delivery],
  );

  async function copyCode() {
    if (!activeFile) return;
    await navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    toast.success("Code copied.");
    window.setTimeout(() => setCopied(false), 1500);
  }

  function downloadFile() {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = activeFile.path.split("/").at(-1) || "snippet.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return <Card className="w-full max-w-3xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"><Text color="red" size="2">{error}</Text></Card>;
  }
  if (!delivery || !activeFile) {
    return <Card className="w-full max-w-3xl animate-pulse border border-zinc-200 dark:border-zinc-800"><Text color="gray" size="2">Loading delivered snippet…</Text></Card>;
  }

  return (
    <Card className="w-full max-w-3xl overflow-hidden border border-emerald-300 bg-white shadow-sm dark:border-emerald-800 dark:bg-zinc-900">
      <Flex direction="column" gap="4">
        <Flex justify="between" align="start" gap="3" wrap="wrap">
          <Flex gap="3" align="center">
            <span className="grid size-10 place-content-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><PackageCheck size={21} /></span>
            <div>
              <Heading size="4" className="text-zinc-950 dark:text-zinc-50">{delivery.title}</Heading>
              <Text size="1" color="gray">Developer-approved delivery · Version {delivery.version}</Text>
            </div>
          </Flex>
          <Flex gap="2">
            <Badge color="indigo">{humanizeSnippetValue(delivery.language)}</Badge>
            <Badge color="gray">{humanizeSnippetValue(delivery.category)}</Badge>
          </Flex>
        </Flex>

        <Text size="2" className="text-zinc-700 dark:text-zinc-300">{delivery.description}</Text>

        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          <Flex gap="1" wrap="wrap" className="border-b border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/70">
            {delivery.files.map((file) => (
              <button key={file.path} type="button" onClick={() => setActivePath(file.path)} className={`rounded px-2.5 py-1 text-xs font-medium ${file.path === activeFile.path ? "bg-indigo-600 text-white" : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}>
                {file.path}
              </button>
            ))}
          </Flex>
          <pre className="max-h-80 overflow-auto bg-zinc-950 p-4 text-left text-xs leading-5 text-zinc-100"><code>{activeFile.content}</code></pre>
        </div>

        {delivery.dependencies.length > 0 && (
          <Text size="1" color="gray">Dependencies: {delivery.dependencies.join(", ")}</Text>
        )}
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/60">
          <Text size="1" weight="bold" className="text-zinc-700 dark:text-zinc-200">Usage instructions</Text>
          <Text as="p" size="2" className="mt-1 whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">{delivery.usageInstructions}</Text>
        </div>

        <Flex gap="2" justify="end" wrap="wrap">
          <Button type="button" variant="soft" color="gray" onClick={() => void copyCode()}>
            {copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy code"}
          </Button>
          <Button type="button" color="indigo" onClick={downloadFile}>
            <Download size={15} />Download {activeFile.path.split("/").at(-1)}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
