import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "~/components/ui/animation/fade";
import { MessageForm } from "~/components/ui/message_form";
import { OwnersCard } from "~/components/ui/owners";
import { cn } from "~/lib/utils";

export default function Home() {
  return (
    <main className="flex flex-col font-[family-name:var(--font-geist-sans)]">
      <div className="relative pt-16 pb-32 flex items-center justify-center min-h-[95vh]">
        <HeroSection />
      </div>
      <IntroSection />
      <PlanSection />
      <OwnersCard />
      <Engage />
      <MessageForm />
    </main>
  );
}

const HeroSection = () => {
  return (
    <div
      className={cn(
        "w-full h-screen absolute justify-center"
      )}
    >
      <div className="absolute bg-center bg-cover w-full block overflow-hidden">
        <video className="w-full h-screen top-0 overflow-hidden z-10 aspect-auto bg-cover object-cover" autoPlay muted loop>
          <source src="/vids/bg-vid.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="relative flex flex-col w-full max-w-2xl h-full mx-auto mt-32">
        <FadeIn delay={0.7} direction="down">
          <div className="inline-block items-center space-y-5 sm:px-4 text-center justify-center text-slate-400">
          <h1 className="text-5xl">Kubuka Space PBC</h1>
          <p className="text-xs">Scouting the hidden genius. We can give your business or idea some energy to reach the stratosphere.</p>
          </div>
        </FadeIn>
      </div>
      <div
        className="bottom-0 top-0 left-0 right-0 w-full relative pointer-events-none overflow-hidden -mt-20"
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
            className="fill-white"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
  );
}

const IntroSection = () => {
  return (
    <section id="introduction" className="relative pb-8 lg:pb-20 border-0">
      <div className="w-full mx-auto px-4">
        <div className="max-w-5xl justify-center mx-auto flex flex-col md:flex-row -mt-48">
          <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
            <FadeIn delay={0.4} direction="up">
              <div className="relative flex flex-col min-w-0 break-words bg-gradient-to-br from-teal-200 via-lime-300 to-green-300 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto text-slate-600">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>

                  </div>
                  <h6 className="text-xl font-semibold">Innovative Startup</h6>
                  <p className="mt-2 mb-4 text-justify">
                    Our products are suitable for creating a a product that fits your portfolio to meet your needs.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="w-full md:w-4/12 px-4 text-center">
            <FadeIn delay={0.6} direction="up">
              <div className="relative flex flex-col min-w-0 break-words bg-gradient-to-t from-teal-200 via-lime-300 to-green-300 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto text-slate-600">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>

                  </div>
                  <h6 className="text-xl font-semibold">
                    Making Ideas
                  </h6>
                  <p className="mt-2 mb-4 text-justify">
                    We can generate ideas for your organisation and lint them to suite your business environment.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="pt-6 w-full md:w-4/12 px-4 text-center">
            <FadeIn delay={0.8} direction="up">
              <div className="relative flex flex-col min-w-0 break-words bg-gradient-to-bl from-teal-200 via-lime-300 to-green-300 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto text-slate-600">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>

                  </div>
                  <h6 className="text-xl font-semibold">
                    Verified Company
                  </h6>
                  <p className="mt-2 mb-4 text-justify">
                    Our company is formally registered, which means all transactions we perform are fully compliant with the law.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <div id="check-us" className="flex flex-col md:flex-row items-center mt-8">
          <div className="w-full md:w-5/12 px-4 mx-auto sm:my-16">
            <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-gray-100">
              <BuildingStorefrontIcon className="w-8 h-8 stroke-purple-300" />
            </div>
            <h3 className="text-3xl mb-2 font-semibold leading-normal">
              Find us
            </h3>
            <p className="text-lg font-[200] leading-relaxed my-4 text-gray-600">
              Each transaction you perform with us is treated with excellence. There is nothing more which will bind our organisation to yours than that first interaction.
            </p>
            <p className="text-lg font-[200] leading-relaxed mt-0 mb-4 text-gray-600">
              We will bring you more results to the table to match your expectations. When we exceed them we won&apos;t ask you for a refund or a top-up, that is because we value the business relationship.
            </p>
            <Link
              href="/store"
              className="font-bold text-gray-800 mt-8"
            >
              Check out our store for more!
            </Link>
          </div>

          <div className="w-full md:w-4/12 px-4 mx-auto lg:mt-0 mt-16">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-pink-600">
              <Image
                alt="..."
                src="/images/Bermuda.svg"
                className="w-full align-middle rounded-t-lg"
                width={16}
                height={16}
              />
              <blockquote className="relative p-8 mb-4">
                <svg
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 583 95"
                  className="absolute left-0 w-full block border-0"
                  style={{
                    height: "95px",
                    top: "-94px"
                  }}
                >
                  <polygon
                    points="-30,95 583,95 583,65"
                    className="text-pink-600 fill-current"
                  ></polygon>
                </svg>
                <h4 className="text-xl font-bold text-white">
                  Top Notch Services
                </h4>
                <p className="text-md font-light mt-2 text-white">
                  Our ideal is to interact with our business partners as if interacting with friends. We won&apos;t leave you to ponder what we are doing behind your back, but we&apos;ll walk with you all the way through in your product development.
                </p>
              </blockquote>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

const PlanSection = () => {
  return (
    <section id="our-products" className="relative h-screen justify-center items-center bg-white w-full">
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
              <h3 className="text-3xl font-semibold">
                A growing company
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
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
                      <h4 className="text-gray-600">
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
                      <h4 className="text-gray-600">Sample code to help you choose</h4>
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
                      <h4 className="text-gray-600">Simple integratable code.</h4>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bottom-0 top-0 left-0 right-0 w-full z-20 relative pointer-events-none overflow-hidden -mb-28 lg:-mb-40 rotate-180"
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
            className="fill-white border-0"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </section>
  );
}

const Engage = () => {
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
            className="text-gray-900 fill-current border-0"
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
              Having a busy schedule, we are here to help. We can take away most of the stressful jobs by building you a site which will handle most of your business transactions.
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