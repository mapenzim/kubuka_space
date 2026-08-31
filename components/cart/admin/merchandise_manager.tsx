"use client";

import { useState } from "react";
import { Button, Card, Dialog, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { toast } from "sonner";
import {
  createMerchandise,
  setMerchandiseDeleted,
  updateMerchandise,
} from "@/app/actions/merchandiseActions.server";
import { useStoreProductDialog } from "./store_product_context";
import AdminDialogButton from "@/components/admin/AdminDialogButton";

type Product = {
  id: string;
  title: string;
  body: string;
  price: number;
  deletedAt: string | null;
  stockQuantity: number;
  categoryId: string | null;
  category?: { name: string } | null;
};

type Category = { id: string; name: string };

const emptyForm = { title: "", body: "", price: "", stockQuantity: "", categoryId: "" };

export default function MerchandiseManager({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: Category[];
}) {
  const { dialogOpen, mode, openEdit, closeDialog } = useStoreProductDialog();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories] = useState<Category[]>(initialCategories);

  async function save() {
    try {
      const isEditing = mode === "edit";
      if (isEditing && !editingId) {
        throw new Error("No product selected for editing.");
      }
      const input = { title: form.title, body: form.body, price: Number(form.price), stockQuantity: Number(form.stockQuantity), categoryId: form.categoryId || undefined };
      const product = isEditing
        ? await updateMerchandise({ ...input, id: editingId! })
        : await createMerchandise(input);

      setProducts((current) => isEditing
              ? current.map((item) => item.id === editingId ? product as Product : item)
        : [product as Product, ...current]);
      setForm(emptyForm);
      setEditingId(null);
      closeDialog();
      toast.success(isEditing ? "Product updated." : "Product created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product.");
    }
  }

  async function toggleDeleted(product: Product) {
    try {
      const updated = await setMerchandiseDeleted(product.id, !product.deletedAt);
      setProducts((current) => current.map((item) => item.id === product.id ? updated as Product : item));
      toast.success(product.deletedAt ? "Product restored." : "Product removed from store.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update product.");
    }
  }

  function resetAndCloseDialog() {
    setEditingId(null);
    setForm(emptyForm);
    closeDialog();
  }

  return (
    <>
      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) resetAndCloseDialog();
        }}
      >
        <Dialog.Content
          maxWidth="520px"
          className="bg-white! text-zinc-900 dark:bg-zinc-900! dark:text-zinc-100"
        >
          <Dialog.Title>{mode === "edit" ? "Edit product" : "Add product"}</Dialog.Title>
          <Dialog.Description size="2" color="gray">{mode === "edit" ? "Update this storefront product." : "Create a product for the storefront."}</Dialog.Description>
          <Flex direction="column" gap="3" mt="4">
            <TextField.Root placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextField.Root placeholder="Description" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Flex gap="2"><TextField.Root className="flex-1" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><TextField.Root className="flex-1" type="number" min="0" step="1" placeholder="Stock" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} /></Flex>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="h-9 rounded-md border border-gray-300 bg-transparent px-3 text-sm"><option value="">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
            <Flex justify="end" gap="2" mt="2">
              <AdminDialogButton
                type="button"
                variant="secondary"
                onClick={resetAndCloseDialog}
              >
                Cancel
              </AdminDialogButton>
              <AdminDialogButton type="button" onClick={() => void save()}>
                {mode === "edit" ? "Save changes" : "Add product"}
              </AdminDialogButton>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      <Card>
      <Flex direction="column" gap="3" p="4">
        <Heading size="4">Products</Heading>
        {products.map((product) => (
          <Flex key={product.id} justify="between" align="center" className="border-t pt-3">
            <Flex direction="column">
              <Text weight="bold">{product.title}{product.deletedAt ? " (removed)" : ""}</Text>
              <Text size="2" color="gray">${product.price.toFixed(2)} · {product.stockQuantity} in stock · {product.category?.name ?? "Uncategorized"} · {product.body}</Text>
            </Flex>
            <Flex gap="2">
              <Button variant="soft" onClick={() => { setEditingId(product.id); setForm({ title: product.title, body: product.body, price: String(product.price), stockQuantity: String(product.stockQuantity), categoryId: product.categoryId ?? "" }); openEdit(); }}>Edit</Button>
              <Button color={product.deletedAt ? "green" : "red"} variant="soft" onClick={() => void toggleDeleted(product)}>{product.deletedAt ? "Restore" : "Remove"}</Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
      </Card>
    </>
  );
}
