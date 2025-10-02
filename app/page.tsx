import Image from "next/image";

export default async function Home() {

  return (
      <section className="flex flex-col gap-6">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <div className="max-w-prose md:max-w-none">
                <h4 className="text-lg font-bold text-red-700">
                  Maintenance Mode
                </h4>
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Kubuka Space PBC</h2>
                <p className="mt-4 text-gray-700">
                  The website is still under maintenance. Kubuka will come back stronger in a moment. 
                </p>
              </div>
            </div>
            <div>
              <Image
                src="https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
