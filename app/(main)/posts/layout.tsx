import { PropsType } from "@/lib/utils";

export default async function Layout({ children }: PropsType){
  return (
    <section className="w-full min-h-screen overflow-y-auto items-center justify-center">
      {children}
    </section>
  );
}
