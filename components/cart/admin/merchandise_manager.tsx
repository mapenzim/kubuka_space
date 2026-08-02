"use client";

import { useEffect, useState } from "react";
import { Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { toast } from "sonner";
import {
  createMerchandise,
  getMerchandiseForAdmin,
  setMerchandiseDeleted,
  updateMerchandise,
} from "@/app/actions/merchandiseActions.server";

type Product = {
  id: string;
  title: string;
  body: string;
  price: number;
  deletedAt: string | null;
  stockQuantity: number;
};

const emptyForm = { title: "", body: "", price: "", stockQuantity: "" };

export default function MerchandiseManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchandiseForAdmin()
      .then((items) => setProducts(items as Product[]))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load products."))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    try {
      const input = { title: form.title, body: form.body, price: Number(form.price), stockQuantity: Number(form.stockQuantity) };
      const product = editingId
        ? await updateMerchandise({ ...input, id: editingId })
        : await createMerchandise(input);

      setProducts((current) => editingId
              ? current.map((item) => item.id === editingId ? product as Product : item)
        : [product as Product, ...current]);
      setForm(emptyForm);
      setEditingId(null);
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
    <Card>
      <Flex direction="column" gap="3" p="4">
        <Heading size="4">Products</Heading>
        <Flex gap="2" wrap="wrap">
          <TextField.Root placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField.Root placeholder="Description" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <TextField.Root type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <TextField.Root type="number" min="0" step="1" placeholder="Stock" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
          <Button onClick={() => void save()}>{editingId ? "Update" : "Add product"}</Button>
          {editingId && <Button variant="soft" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>}
        </Flex>
        {loading ? <Text color="gray">Loading products…</Text> : products.map((product) => (
          <Flex key={product.id} justify="between" align="center" className="border-t pt-3">
            <Flex direction="column">
              <Text weight="bold">{product.title}{product.deletedAt ? " (removed)" : ""}</Text>
              <Text size="2" color="gray">${product.price.toFixed(2)} · {product.stockQuantity} in stock · {product.body}</Text>
            </Flex>
            <Flex gap="2">
              <Button variant="soft" onClick={() => { setEditingId(product.id); setForm({ title: product.title, body: product.body, price: String(product.price), stockQuantity: String(product.stockQuantity) }); }}>Edit</Button>
              <Button color={product.deletedAt ? "green" : "red"} variant="soft" onClick={() => void toggleDeleted(product)}>{product.deletedAt ? "Restore" : "Remove"}</Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
}
