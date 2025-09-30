import FadeIn from "~/components/ui/animation/fade";

export default function Page() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <FadeIn delay={0.6} direction="down">
        <h1 className="text-indigo-600 text-5xl font-bold">Blog column</h1>
      </FadeIn>
    </div>
  );
}