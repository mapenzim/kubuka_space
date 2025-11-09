import { PropsType } from "@/lib/utils";

export default function Layout({ children }: PropsType) {
  return (
    <section className="w-fill min-h-screen overflow-y-auto items-center justify-center pt-16 pl-4">
      {children}
    </section>
  );
}