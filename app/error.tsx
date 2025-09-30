/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@headlessui/react";
import { useEffect } from "react";

export default function Error({ error, reset }: any) {
  useEffect(() => {
    console.log("Logging error:", error)
  },[error]);

  return (
    <section className="flex w-full h-screen items-center justify-center">
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Error</h2>
        <p className="text-sm text-pink-600/60">{error?.message}</p>
        <div>
          <Button onClick={() => reset()} 
            className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
          >Try Again</Button>
        </div>
      </div>
    </section>
  );
}