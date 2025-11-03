import Loading from "@/components/loading";
import Footer from "@/components/ui/foot";
import { NavigationBar } from "@/components/ui/head";
import { PropsType } from "@/lib/utils";
import { Suspense } from "react";

export default async function Layout({ children }: PropsType){
  return (
    <div className="w-full overflow-auto">
      <NavigationBar />
      <div className="min-h-screen">
        <div className="relative mx-auto flex h-full ">
          <div className="md:w-6/12 flex items-center justify-center">
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
