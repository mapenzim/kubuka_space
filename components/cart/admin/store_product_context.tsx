"use client";

import { createContext, useContext, useMemo, useState } from "react";

type StoreProductContextValue = { dialogOpen: boolean; mode: "create" | "edit"; openCreate: () => void; openEdit: () => void; closeDialog: () => void };
const StoreProductContext = createContext<StoreProductContextValue | null>(null);

export function StoreProductProvider({ children }: { children: React.ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const value = useMemo(() => ({
    dialogOpen,
    mode,
    openCreate: () => { setMode("create"); setDialogOpen(true); },
    openEdit: () => { setMode("edit"); setDialogOpen(true); },
    closeDialog: () => setDialogOpen(false),
  }), [dialogOpen, mode]);
  return <StoreProductContext.Provider value={value}>{children}</StoreProductContext.Provider>;
}

export function useStoreProductDialog() {
  const context = useContext(StoreProductContext);
  if (!context) throw new Error("useStoreProductDialog must be used within StoreProductProvider");
  return context;
}
