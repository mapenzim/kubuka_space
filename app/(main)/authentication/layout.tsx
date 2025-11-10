import { PropsType } from "@/lib/utils";

export default async function Layout({ children }: PropsType){
  return (
    <div className="w-full overflow-auto">
      <div className="min-h-screen items-center justify-center">
        <div className="relative">
          <div className="md:w-full mx-auto px-2 md:px-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
