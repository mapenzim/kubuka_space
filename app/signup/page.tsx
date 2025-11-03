"use client";
import { useTransition } from "react";
import Link from "next/link";
import { createUser } from "../actions/adminActions";

export default function SignupPage() {

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      await createUser(form); // server action
      e.currentTarget.reset();
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-80 flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create account</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={isPending}
        >
          {isPending ? "loading..." : "Submit"}
        </button>
        <Link href="/signin" className="text-indigo-500 hover:text-indigo-300 text-end mt-2">Login</Link>
      </form>
    </div>
  );
}
