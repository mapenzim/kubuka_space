import Image from "next/image";

const PlanSection = () => {
  return (
    <section id="our-products" className="relative flex h-screen bg-indigo-300 dark:bg-slate-900 dark:border-b border-teal-400 w-full items-center justify-center">
      <div className="">
        <div className="flex flex-col-reverse md:flex-row items-center gap-y-5">
          <div className="w-full md:w-4/12 mx-auto px-4">
            <Image
              alt="..."
              className="max-w-full rounded-lg shadow-lg"
              src="/images/victoria-falls.jpg"
              width={600}
              height={400}
            />
          </div>
          <div className="w-full md:w-5/12 mx-auto sm:mt-16 px-4">
            <div className="md:pr-12">
              <div className="text-orange-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>

              </div>
              <h3 className="text-3xl font-semibold dark:text-zinc-400">
                A growing company
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-slate-400">
                We are not stagnant but growing daily. Meet us along so that we also help your organisation to grow and reach levels you did not expect.
              </p>
              <ul className="list-none mt-6">
                <li className="py-2">
                  <div className="flex items-center">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-slate-600 bg-slate-200 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                      </svg>

                    </span>
                    <div>
                      <h4 className="text-gray-600 dark:text-slate-400">
                        Carefully selected products
                      </h4>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-violet-600 bg-indigo-200 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="text-gray-600 dark:text-slate-400">Sample code to help you choose</h4>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-500 bg-teal-200 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="text-gray-600 dark:text-slate-400">Simple integratable code.</h4>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlanSection;