import { WrenchIcon } from "lucide-react";
import Image from "next/image";

export default async function Home() {

  return (
      <section className="flex flex-col gap-6">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <div className="max-w-prose md:max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl flex w-w-full text-justify">Kubuka Space PBC</h2>
                <div className="flex flex-row justify-start space-x-4 mt-2">
                  <WrenchIcon className="animate-bounce" />
                  <h4 className="text-lg font-bold text-red-700">
                    Maintenance Mode
                  </h4>
                </div>
                <p className="mt-4 text-gray-700 text-justify">
                  The website is still under maintenance. Kubuka will come back stronger in a moment. 
                </p>
              </div>
            </div>
            <div>
              <Image
                src="/images/kubuka-logo.png"
                className="rounded"
                alt=""
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </section>
  );
}
