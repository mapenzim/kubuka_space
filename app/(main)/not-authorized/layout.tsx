import Loader from "@/components/loading/loader";
import { ReactNode, Suspense } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-auto">
      <div className="min-h-screen items-center justify-center pt-8">
        <div className="relative">
          <div className="md:w-6/12 mx-auto px-2 md:px-0">
            <Suspense fallback={<Loader page="End region" />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
