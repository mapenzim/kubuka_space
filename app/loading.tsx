import Loader from "@/components/loading/loader";

export default function Loading() {
  return (
    <section className="fixed w-full h-screen flex items-center justify-center bg-gray-300 opacity-75 z-50">
      <Loader page={undefined} />
    </section>
  );
}