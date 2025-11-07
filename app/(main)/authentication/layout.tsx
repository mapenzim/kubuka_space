import Loading from "@/components/loading";
import { NavigationBar } from "@/components/ui/head";
import { PropsType } from "@/lib/utils";
import { Suspense } from "react";

export default async function Layout({ children }: PropsType){
  return (
    <div className="w-full overflow-auto">
      <NavigationBar />
      <div className="min-h-screen items-center justify-center pt-8">
        <div className="relative">
          <div className="md:w-6/12 mx-auto">
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
