
const EngageSection = () => {
  return (
    <section id="what-we-offer" className="min-h-screen w-full py-16 relative block bg-gray-900">
      <div
        className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 border-none"
        style={{ height: "80px" }}
      >
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="text-gray-900 fill-current dark:border-b border-amber-400"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>

      <div className="mx-auto px-4 lg:pt-12 lg:pb-16 text-slate-300">
        <div className="flex flex-wrap text-center justify-center">
          <div className="w-full lg:w-6/12 px-4">
            <h2 className="text-4xl font-semibold">
              We help you achieve more
            </h2>
            <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-500">
              We take the stress out of your day by giving you a product that streamlines your operations and handles most of your business transactions. With our solutions, you can focus on growth while your site takes care of the heavy lifting.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap mt-12 justify-center">
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-teal-600 p-3 w-12 h-12 shadow-lg rounded-full bg-slate-200 inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
              </svg>

            </div>
            <h6 className="text-xl mt-5 font-semibold">
              Excellent service
            </h6>
            <p className="mt-2 mb-4 text-gray-500">
              We will deliver your site the way you like it. You just load your data and set off to the market.
            </p>
          </div>
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-indigo-600 p-3 w-12 h-12 shadow-lg rounded-full bg-slate-200 inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h5 className="text-xl mt-5 font-semibold">
              Grow your market
            </h5>
            <p className="mt-2 mb-4 text-gray-500">
              Just by the click of a button, a website will inject itself where the market is prime. Try it now.
            </p>
          </div>
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-orange-300 p-3 w-12 h-12 shadow-lg rounded-full bg-slate-200 inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>

            </div>
            <h5 className="text-xl mt-5 font-semibold">
              Launch time
            </h5>
            <p className="mt-2 mb-4 text-gray-500">
              We will even help you Launch your product at the earliest convenience to get you going.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EngageSection;