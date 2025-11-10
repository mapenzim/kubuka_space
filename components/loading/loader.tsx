"use client";

import { SettingsIcon } from "lucide-react";

export default function Loader({page}: {page: string | undefined}) {

  return (
    <section className="flex w-full h-screen items-center justify-center">
      <div className="flex gap-2">
        <SettingsIcon className="animate-spin" />
        <h2 className="text-lg font-bold">Please wait, loading '{page}'</h2>
      </div>
    </section>
  );
}
