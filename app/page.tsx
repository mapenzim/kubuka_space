import CountdownTimer from "@/components/countdown";
import { WrenchIcon } from "lucide-react";
import Image from "next/image";

export default async function Home() {

  return (
      <section className="flex flex-col gap-6">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <div className="max-w-prose md:max-w-none">
                <div className="flex w-full items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl flex w-w-full text-justify">Kubuka Space PBC</h2>
                  <Image
                    src="/images/kubuka-logo.png"
                    className="rounded"
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex flex-row justify-start space-x-4 my-8">
                  <WrenchIcon className="animate-bounce" />
                  <h4 className="text-lg font-bold text-red-700">
                    Maintenance Mode
                  </h4>
                </div>
                <CountdownTimer targetDate="2025-10-31T23:59:59" />
                <p className="mt-16 text-gray-700 text-justify">
                  Kubuka is still undergoing maintenance. <br />
                  See you soonest. <br /><br />
                  Admin
                </p>
                <p className="text-indigo-800 font-semibold">&copy;{new Date().getFullYear()} - Kubuka Space PBC</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
