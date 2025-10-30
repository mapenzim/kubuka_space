import { NavigationBar } from "@/components/ui/head";
import { PropsType } from "@/lib/utils";

export default async function Layout({ children }: PropsType){
  return (
    <div className="w-full items-end justify-center">
      <NavigationBar />
      { children }
    </div>
  );
}
