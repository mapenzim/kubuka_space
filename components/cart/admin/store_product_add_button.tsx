"use client";

import { Button } from "@radix-ui/themes";
import { useStoreProductDialog } from "./store_product_context";

export default function StoreProductAddButton() {
  const { openCreate } = useStoreProductDialog();
  return <Button size="3" color="indigo" onClick={openCreate} style={{ cursor: "pointer" }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    Add Product
  </Button>;
}
