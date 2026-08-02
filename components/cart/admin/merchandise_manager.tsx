"use client";

import { useEffect, useState } from "react";
import { Button, Card, Dialog, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { toast } from "sonner";
import {
  createMerchandise,
  getMerchandiseForAdmin,
  setMerchandiseDeleted,
  updateMerchandise,
  getProductCategories,
} from "@/app/actions/merchandiseActions.server";
import { useStoreProductDialog } from "./store_product_context";

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

export default function MerchandiseManager() {
  const { dialogOpen, mode, openEdit, closeDialog } = useStoreProductDialog();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (dialogOpen && mode === "create") {
      setEditingId(null);
      setForm(emptyForm);
    }
  }, [dialogOpen, mode]);

  useEffect(() => {
    getMerchandiseForAdmin()
      .then((items) => setProducts(items as Product[]))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load products."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getProductCategories().then((items) => setCategories(items as Category[])).catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load categories."));
  }, []);

  async function save() {
    try {
      const input = { title: form.title, body: form.body, price: Number(form.price), stockQuantity: Number(form.stockQuantity), categoryId: form.categoryId || undefined };
      const product = editingId
        ? await updateMerchandise({ ...input, id: editingId })
        : await createMerchandise(input);

      setProducts((current) => editingId
              ? current.map((item) => item.id === editingId ? product as Product : item)
        : [product as Product, ...current]);
      setForm(emptyForm);
      setEditingId(null);
      closeDialog();
      toast.success(editingId ? "Product updated." : "Product created.");
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

  return (
    <>
      <Dialog.Root open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <Dialog.Content maxWidth="520px">
          <Dialog.Title>{mode === "edit" ? "Edit product" : "Add product"}</Dialog.Title>
          <Dialog.Description size="2" color="gray">{mode === "edit" ? "Update this storefront product." : "Create a product for the storefront."}</Dialog.Description>
          <Flex direction="column" gap="3" mt="4">
            <TextField.Root placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextField.Root placeholder="Description" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Flex gap="2"><TextField.Root className="flex-1" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><TextField.Root className="flex-1" type="number" min="0" step="1" placeholder="Stock" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} /></Flex>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="h-9 rounded-md border border-gray-300 bg-transparent px-3 text-sm"><option value="">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
            <Flex justify="end" gap="2" mt="2"><Button variant="soft" onClick={() => { setEditingId(null); setForm(emptyForm); closeDialog(); }}>Cancel</Button><Button onClick={() => void save()}>{mode === "edit" ? "Save changes" : "Add product"}</Button></Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      <Card>
      <Flex direction="column" gap="3" p="4">
        <Heading size="4">Products</Heading>
        {loading ? <Text color="gray">Loading products…</Text> : products.map((product) => (
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
