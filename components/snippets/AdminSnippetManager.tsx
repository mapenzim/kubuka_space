"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Badge, Button, Card, Dialog, Flex, Heading, Text, TextArea, TextField } from "@radix-ui/themes";
import { FileCode2, PackagePlus, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminDialogButton from "@/components/admin/AdminDialogButton";
import {
  createSnippetProduct,
  deliverSnippetRequest,
  generateSnippetWithOllama,
  updateSnippetRequestStatus,
} from "@/app/actions/snippetActions.server";
import {
  ADMIN_SNIPPET_COUNT_EVENT,
  humanizeSnippetValue,
  isActiveSnippetRequestStatus,
  PYTHON_SNIPPET_CATEGORIES,
  SNIPPET_REQUEST_STATUSES,
  SnippetCategoryValue,
  SnippetFile,
  SnippetLanguageValue,
  SnippetRequestStatusValue,
  WEB_SNIPPET_CATEGORIES,
} from "@/lib/snippets";

export interface AdminSnippetProduct {
  id: string;
  merchandiseId: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  deletedAt: string | null;
  language: SnippetLanguageValue;
  categories: SnippetCategoryValue[];
}

export interface AdminSnippetRequest {
  id: string;
  customer: string;
  email: string;
  productTitle: string;
  language: SnippetLanguageValue;
  category: SnippetCategoryValue;
  primaryColor: string | null;
  textColor: string | null;
  backgroundColor: string | null;
  fontFamily: string | null;
  appearance: string | null;
  responsive: boolean;
  instructions: string | null;
  status: SnippetRequestStatusValue;
  createdAt: string;
  deliveryVersion: number | null;
  deliveredAt: string | null;
}

const emptyProduct = {
  title: "",
  description: "",
  price: "",
  stockQuantity: "10",
  language: "HTML" as SnippetLanguageValue,
  categories: [...WEB_SNIPPET_CATEGORIES],
};

const LOCAL_OLLAMA_ENABLED = process.env.NODE_ENV === "development";

function starterFile(request: AdminSnippetRequest): SnippetFile {
  if (request.language === "HTML") return { path: "index.html", content: "" };
  if (request.language === "REACT") return { path: `${humanizeSnippetValue(request.category).replaceAll(" ", "")}Component.tsx`, content: "" };
  return { path: "main.py", content: "" };
}

function statusColor(status: SnippetRequestStatusValue) {
  if (status === "DELIVERED") return "green" as const;
  if (status === "REJECTED") return "red" as const;
  if (status === "READY") return "blue" as const;
  if (status === "REVIEW") return "violet" as const;
  if (status === "GENERATING") return "orange" as const;
  return "gray" as const;
}

export default function AdminSnippetManager({
  initialProducts,
  initialRequests,
}: {
  initialProducts: AdminSnippetProduct[];
  initialRequests: AdminSnippetRequest[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [requests, setRequests] = useState(initialRequests);
  const [productOpen, setProductOpen] = useState(false);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdminSnippetRequest | null>(null);
  const [deliveryTitle, setDeliveryTitle] = useState("");
  const [deliveryDescription, setDeliveryDescription] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState<SnippetFile[]>([]);
  const [dependencies, setDependencies] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const [generatingRequestId, setGeneratingRequestId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableCategories = productForm.language === "PYTHON"
    ? PYTHON_SNIPPET_CATEGORIES
    : WEB_SNIPPET_CATEGORIES;
  const activeRequests = useMemo(
    () => requests.filter((request) => isActiveSnippetRequestStatus(request.status)),
    [requests],
  );

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(ADMIN_SNIPPET_COUNT_EVENT, {
      detail: activeRequests.length,
    }));
  }, [activeRequests.length]);

  function changeLanguage(language: SnippetLanguageValue) {
    setProductForm((current) => ({
      ...current,
      language,
      categories: language === "PYTHON" ? [...PYTHON_SNIPPET_CATEGORIES] : [...WEB_SNIPPET_CATEGORIES],
    }));
  }

  function toggleCategory(category: SnippetCategoryValue) {
    setProductForm((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
  }

  function saveProduct() {
    startTransition(async () => {
      try {
        const product = await createSnippetProduct({
          ...productForm,
          price: Number(productForm.price),
          stockQuantity: Number(productForm.stockQuantity),
        });
        setProducts((current) => [product, ...current]);
        setProductForm(emptyProduct);
        setProductOpen(false);
        toast.success("Snippet product added to the store.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to add the product.");
      }
    });
  }

  function changeStatus(request: AdminSnippetRequest, status: SnippetRequestStatusValue) {
    startTransition(async () => {
      try {
        const updated = await updateSnippetRequestStatus(request.id, status);
        setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status: updated.status } : item));
        toast.success("Request status updated.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to update the request.");
      }
    });
  }

  function openDelivery(request: AdminSnippetRequest) {
    setSelectedRequest(request);
    setDeliveryTitle(`${humanizeSnippetValue(request.language)} ${humanizeSnippetValue(request.category)}`);
    setDeliveryDescription(`A developer-approved ${humanizeSnippetValue(request.category).toLowerCase()} prepared for ${request.customer}.`);
    setDeliveryFiles([starterFile(request)]);
    setDependencies("");
    setUsageInstructions("");
    setDeliveryOpen(true);
  }

  function downloadBrief(request: AdminSnippetRequest) {
    const brief = {
      requestId: request.id,
      product: request.productTitle,
      language: request.language,
      category: request.category,
      preferences: {
        primaryColor: request.primaryColor,
        textColor: request.textColor,
        backgroundColor: request.backgroundColor,
        fontFamily: request.fontFamily,
        appearance: request.appearance,
        responsive: request.responsive,
      },
      instructions: request.instructions,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `snippet-request-${request.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function generateWithOllama(request: AdminSnippetRequest) {
    const previousStatus = request.status;
    setGeneratingRequestId(request.id);
    setRequests((current) => current.map((item) =>
      item.id === request.id ? { ...item, status: "GENERATING" } : item
    ));
    const toastId = toast.loading("Ollama is generating the snippet locally. This may take a few minutes…");

    try {
      const generated = await generateSnippetWithOllama(request.id);
      const updatedRequest = { ...request, status: generated.status };
      setRequests((current) => current.map((item) =>
        item.id === request.id ? { ...item, status: generated.status } : item
      ));
      setSelectedRequest(updatedRequest);
      setDeliveryTitle(generated.title);
      setDeliveryDescription(generated.description);
      setDeliveryFiles(generated.files);
      setDependencies(generated.dependencies.join(", "));
      setUsageInstructions(generated.usageInstructions);
      setDeliveryOpen(true);
      toast.success(`Generated with ${generated.model}. Review every file before delivery.`, { id: toastId });
    } catch (error) {
      setRequests((current) => current.map((item) =>
        item.id === request.id ? { ...item, status: previousStatus } : item
      ));
      toast.error(error instanceof Error ? error.message : "Unable to generate the snippet.", { id: toastId });
    } finally {
      setGeneratingRequestId(null);
    }
  }

  async function importDelivery(file: File | undefined) {
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text()) as {
        requestId?: unknown;
        language?: unknown;
        category?: unknown;
        title?: unknown;
        description?: unknown;
        files?: unknown;
        dependencies?: unknown;
        usageInstructions?: unknown;
      };
      if (
        typeof payload.requestId === "string" &&
        typeof payload.language === "string" &&
        typeof payload.category === "string" &&
        payload.files === undefined
      ) {
        throw new Error(
          "You selected the exported Ollama request brief. Run the local generator first, then import the resulting .delivery.json file.",
        );
      }
      if (
        typeof payload.title !== "string" ||
        typeof payload.description !== "string" ||
        !Array.isArray(payload.files) ||
        !payload.files.every((item) => typeof item?.path === "string" && typeof item?.content === "string") ||
        !Array.isArray(payload.dependencies) ||
        !payload.dependencies.every((item) => typeof item === "string") ||
        typeof payload.usageInstructions !== "string"
      ) {
        throw new Error(
          "This JSON does not contain a complete snippet delivery. Select the generated .delivery.json file.",
        );
      }
      setDeliveryTitle(payload.title);
      setDeliveryDescription(payload.description);
      setDeliveryFiles(payload.files as SnippetFile[]);
      setDependencies(payload.dependencies.join(", "));
      setUsageInstructions(payload.usageInstructions);
      toast.success("Generated delivery imported. Review it before sending.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to import the delivery.");
    }
  }

  function addFile() {
    setDeliveryFiles((current) => [...current, { path: "", content: "" }]);
  }

  function updateFile(index: number, field: keyof SnippetFile, value: string) {
    setDeliveryFiles((current) => current.map((file, fileIndex) => fileIndex === index ? { ...file, [field]: value } : file));
  }

  function removeFile(index: number) {
    setDeliveryFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }

  function deliver() {
    if (!selectedRequest) return;
    startTransition(async () => {
      try {
        const result = await deliverSnippetRequest({
          requestId: selectedRequest.id,
          title: deliveryTitle,
          description: deliveryDescription,
          files: deliveryFiles,
          dependencies: dependencies.split(","),
          usageInstructions,
        });
        setRequests((current) => current.map((item) => item.id === selectedRequest.id ? {
          ...item,
          status: result.status,
          deliveryVersion: result.version,
          deliveredAt: result.deliveredAt,
        } : item));
        setDeliveryOpen(false);
        toast.success("Snippet delivered to the customer’s chat.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to deliver the snippet.");
      }
    });
  }

  return (
    <Flex direction="column" gap="6">
      <Flex justify="between" align="end" gap="3" wrap="wrap">
        <div>
          <Heading as="h1" size="6">Snippet marketplace</Heading>
          <Text size="2" color="gray">Sell snippet credits, review customer requirements, and deliver approved source files through chat.</Text>
        </div>
        <Button type="button" onClick={() => setProductOpen(true)}><PackagePlus size={17} />Add snippet product</Button>
      </Flex>

      <Card>
        <Flex direction="column" gap="4" p="3">
          <Flex justify="between" align="center"><Heading size="4">Store products</Heading><Badge>{products.length}</Badge></Flex>
          {products.length === 0 ? (
            <Text color="gray" className="rounded-lg border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">No snippet products yet. Add HTML, React, or Python products to start selling request credits.</Text>
          ) : products.map((product) => (
            <Flex key={product.id} justify="between" align="center" gap="4" wrap="wrap" className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
              <div>
                <Flex gap="2" align="center"><Text weight="bold">{product.title}</Text><Badge color="indigo">{humanizeSnippetValue(product.language)}</Badge></Flex>
                <Text size="2" color="gray">${product.price.toFixed(2)} · {product.stockQuantity} available · {product.categories.map(humanizeSnippetValue).join(", ")}</Text>
              </div>
              <Button asChild size="1" variant="soft"><a href={`/store?category=code-snippets`}>View in store</a></Button>
            </Flex>
          ))}
        </Flex>
      </Card>

      <Card>
        <Flex direction="column" gap="4" p="3">
          <Flex justify="between" align="center"><div><Heading size="4">Fulfilment queue</Heading><Text size="2" color="gray">{activeRequests.length} active request{activeRequests.length === 1 ? "" : "s"}</Text></div><Badge>{requests.length}</Badge></Flex>
          {requests.length === 0 ? (
            <Text color="gray" className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">Customer snippet requests will appear here after a paid purchase.</Text>
          ) : requests.map((request) => (
            <Card key={request.id} variant="surface" className="border border-zinc-200 dark:border-zinc-700">
              <Flex direction="column" gap="3">
                <Flex justify="between" align="start" gap="3" wrap="wrap">
                  <div>
                    <Flex gap="2" align="center" wrap="wrap"><Heading size="3">{request.customer}</Heading><Badge color={statusColor(request.status)}>{humanizeSnippetValue(request.status)}</Badge></Flex>
                    <Text size="1" color="gray">{request.email} · Request {request.id.slice(-6)} · {new Date(request.createdAt).toLocaleString()}</Text>
                  </div>
                  <Flex gap="2"><Badge color="indigo">{humanizeSnippetValue(request.language)}</Badge><Badge color="gray">{humanizeSnippetValue(request.category)}</Badge></Flex>
                </Flex>
                <Text size="2" weight="bold">{request.productTitle}</Text>
                <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <Text size="2">Primary: {request.primaryColor ?? "Developer choice"}</Text>
                  <Text size="2">Text: {request.textColor ?? "Developer choice"}</Text>
                  <Text size="2">Background: {request.backgroundColor ?? "Developer choice"}</Text>
                  <Text size="2">Font: {request.fontFamily ?? "Developer choice"}</Text>
                  <Text size="2">Appearance: {request.appearance ?? "Developer choice"}</Text>
                  <Text size="2">Responsive: {request.responsive ? "Yes" : "No"}</Text>
                </div>
                {request.instructions && <Text as="p" size="2" className="whitespace-pre-wrap rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">{request.instructions}</Text>}
                <Flex justify="end" gap="2" wrap="wrap">
                  {request.status !== "DELIVERED" && (
                    <select disabled={isPending || generatingRequestId === request.id} value={request.status} onChange={(event) => changeStatus(request, event.target.value as SnippetRequestStatusValue)} className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-800">
                      {SNIPPET_REQUEST_STATUSES.filter((status) => status !== "DELIVERED").map((status) => <option key={status} value={status}>{humanizeSnippetValue(status)}</option>)}
                    </select>
                  )}
                  <Button type="button" variant="soft" color="gray" onClick={() => downloadBrief(request)}>Export Ollama brief</Button>
                  {LOCAL_OLLAMA_ENABLED && (
                    <Button
                      type="button"
                      variant="soft"
                      color="violet"
                      loading={generatingRequestId === request.id}
                      disabled={Boolean(generatingRequestId) || request.status === "REJECTED"}
                      onClick={() => void generateWithOllama(request)}
                    >
                      <Sparkles size={15} />
                      {generatingRequestId === request.id ? "Generating…" : "Generate with Ollama"}
                    </Button>
                  )}
                  <Button type="button" disabled={isPending || Boolean(generatingRequestId) || request.status === "REJECTED"} onClick={() => openDelivery(request)}><Send size={15} />{request.status === "DELIVERED" ? "Deliver revision" : "Deliver snippet"}</Button>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Card>

      <Dialog.Root open={productOpen} onOpenChange={setProductOpen}>
        <Dialog.Content maxWidth="560px" className="bg-white! text-zinc-900 dark:bg-zinc-900! dark:text-zinc-100">
          <Dialog.Title>Add snippet product</Dialog.Title>
          <Dialog.Description size="2" color="gray">This creates a normal storefront product that grants one request credit per purchased quantity.</Dialog.Description>
          <Flex direction="column" gap="3" mt="4">
            <TextField.Root placeholder="Product title" value={productForm.title} onChange={(event) => setProductForm({ ...productForm, title: event.target.value })} />
            <TextArea placeholder="Store description" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} />
            <Flex gap="2"><TextField.Root className="flex-1" type="number" min="0" step="0.01" placeholder="Price" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} /><TextField.Root className="flex-1" type="number" min="0" step="1" placeholder="Available credits" value={productForm.stockQuantity} onChange={(event) => setProductForm({ ...productForm, stockQuantity: event.target.value })} /></Flex>
            <label className="grid gap-1 text-sm font-medium">Language
              <select value={productForm.language} onChange={(event) => changeLanguage(event.target.value as SnippetLanguageValue)} className="h-10 rounded-md border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-800"><option value="HTML">HTML</option><option value="REACT">React</option><option value="PYTHON">Python</option></select>
            </label>
            <div><Text size="2" weight="bold">Included categories</Text><Flex gap="2" wrap="wrap" mt="2">{availableCategories.map((category) => <label key={category} className="flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"><input type="checkbox" checked={productForm.categories.includes(category)} onChange={() => toggleCategory(category)} />{humanizeSnippetValue(category)}</label>)}</Flex></div>
            <Flex justify="end" gap="2" mt="2"><AdminDialogButton type="button" variant="secondary" onClick={() => setProductOpen(false)}>Cancel</AdminDialogButton><AdminDialogButton type="button" disabled={isPending} onClick={saveProduct}>{isPending ? "Adding…" : "Add to store"}</AdminDialogButton></Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={deliveryOpen} onOpenChange={setDeliveryOpen}>
        <Dialog.Content maxWidth="800px" className="max-h-[90vh] overflow-y-auto bg-white! text-zinc-900 dark:bg-zinc-900! dark:text-zinc-100">
          <Dialog.Title>Deliver approved snippet</Dialog.Title>
          <Dialog.Description size="2" color="gray">The customer will receive a secure code card in their conversation.</Dialog.Description>
          <Flex direction="column" gap="3" mt="4">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-indigo-400 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-950/50">
              Import generated .delivery.json
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  event.currentTarget.value = "";
                  void importDelivery(file);
                }}
              />
            </label>
            <Text size="1" color="gray" align="center">
              The exported request brief is the input for Ollama. Upload the reviewed file created by <code>pnpm snippet:generate</code>, normally named <code>snippet-request-{selectedRequest?.id}.delivery.json</code>.
            </Text>
            <TextField.Root placeholder="Delivery title" value={deliveryTitle} onChange={(event) => setDeliveryTitle(event.target.value)} />
            <TextArea placeholder="Short description" value={deliveryDescription} onChange={(event) => setDeliveryDescription(event.target.value)} />
            {deliveryFiles.map((file, index) => (
              <Card key={index} variant="surface">
                <Flex direction="column" gap="2">
                  <Flex gap="2" align="center"><FileCode2 size={17} /><TextField.Root className="flex-1" placeholder="Relative file path, e.g. components/Header.tsx" value={file.path} onChange={(event) => updateFile(index, "path", event.target.value)} /><Button type="button" variant="soft" color="red" disabled={deliveryFiles.length === 1} onClick={() => removeFile(index)}><Trash2 size={15} /></Button></Flex>
                  <textarea rows={12} spellCheck={false} placeholder="Paste the reviewed source code here" value={file.content} onChange={(event) => updateFile(index, "content", event.target.value)} className="w-full rounded-md border border-zinc-300 bg-zinc-950 p-3 font-mono text-xs leading-5 text-zinc-100 dark:border-zinc-700" />
                </Flex>
              </Card>
            ))}
            <Button type="button" variant="soft" color="gray" disabled={deliveryFiles.length >= 10} onClick={addFile}><Plus size={15} />Add another file</Button>
            <TextField.Root placeholder="Dependencies, comma separated" value={dependencies} onChange={(event) => setDependencies(event.target.value)} />
            <TextArea rows={5} placeholder="Installation and usage instructions" value={usageInstructions} onChange={(event) => setUsageInstructions(event.target.value)} />
            <Flex justify="end" gap="2"><AdminDialogButton type="button" variant="secondary" onClick={() => setDeliveryOpen(false)}>Cancel</AdminDialogButton><AdminDialogButton type="button" disabled={isPending} onClick={deliver}>{isPending ? "Delivering…" : "Deliver to chat"}</AdminDialogButton></Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
