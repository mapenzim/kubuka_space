import Footer from "@/components/ui/foot";
import { NavigationBar } from "@/components/ui/head";
import { PropsType } from "@/lib/utils";

export default async function Layout({ children }: PropsType){
  return (
    <main className="w-full items-center justify-center">
      <NavigationBar />
      { children }
      <Footer />
    </main>
  );
}
