/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@headlessui/react";
import { useEffect } from "react";

export default function Error({ error, reset }: any) {
  useEffect(() => {
    console.log("Logging error:", error)
  },[error]);

  return (
    <section className="w-full h-screen">
      <div className="space-y-4 max-w-4xl mx-auto mt-40">
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