import Loader from "@/components/loading/loader";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center"
    >
      <Loader page={undefined} />
      <span className="sr-only">Loading authentication…</span>
    </div>
  );
}
