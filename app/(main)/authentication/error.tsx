"use client";

interface AuthenticationErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: AuthenticationErrorProps) {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Authentication unavailable
        </h2>
        <p className="text-sm text-red-600 dark:text-red-300">{error.message}</p>
        <div>
          <button
            type="button"
            onClick={reset}
            className="mt-2 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
          >
            Try Again
          </button>
        </div>
      </div>
    </section>
  );
}
