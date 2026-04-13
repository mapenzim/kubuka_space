/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FileJson2Icon } from "lucide-react";
import { useEffect } from "react";

export default function Error({ error, reset }: any) {
  useEffect(() => {
    console.log("Logging error:", error)
  },[error]);

  return (
    <section className="flex w-full h-screen items-center justify-center">
      <div className="space-y-2 p-16">
        
        <h2 className="flex w-fit h-fit items-center gap-x-4 text-lg font-bold text-red-400 dark:border border-pink-500 border-dashed px-2 rounded-md">
          Error
          <FileJson2Icon className="h-5 w-auto" />
        </h2>
        <p className="text-sm text-pink-600/60 dark:text-pink-600">{error?.message}</p>
        <div>
          <button onClick={() => reset()} 
            className="mt-6 inline-block rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring dark:bg-zinc-700 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-zinc-600"
          >Try Again</button>
        </div>
      </div>
    </section>
  );
}
