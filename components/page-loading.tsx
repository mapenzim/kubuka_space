"use client";

import Loading from "./loading";

export default function PageLoading() {

  return (
    <section className="flex w-full h-screen items-center justify-center">
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Generating page, please wait</h2>
        <Loading />
      </div>
    </section>
  );
}
