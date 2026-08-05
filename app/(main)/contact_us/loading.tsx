export default function ContactLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 px-4 py-8 dark:bg-zinc-950 md:px-8">
      <div className="mx-auto grid max-w-6xl animate-pulse gap-6 md:grid-cols-2">
        <div className="h-160 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900" />
        <div className="space-y-6 px-2 py-8 md:px-6">
          <div className="h-8 w-56 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-3">
            <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-64 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-3">
            <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
