"use client";

import { SettingsIcon } from "lucide-react";

export default function Loader({ page }: { page?: string }) {
  return (
    <div className="flex items-center gap-3">
      <SettingsIcon className="animate-spin w-5 h-5 text-green-500" />

      <p className="text-sm sm:text-base font-medium text-gray-700 ">
        {page ? `Loading ${page}...` : "Loading..."}
      </p>
    </div>
  );
}
