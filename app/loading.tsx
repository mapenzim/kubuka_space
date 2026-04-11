import Loader from "@/components/loading/loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      
      {/* 🔲 Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* ⚡ Loader (kept fully visible) */}
      <div className="relative z-10">
        <Loader page={undefined} />
      </div>

    </div>
  );
}