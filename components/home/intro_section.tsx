import Image from "next/image";
import Fading from "../fade";
import { StoreIcon } from "lucide-react";
import Link from "next/link";

export const IntroSection = () => {
  return (
    <section id="introduction" className="relative pb-8 lg:pb-20 border-0">
      <div className="w-full mx-auto px-4">
        <div className="max-w-5xl justify-center mx-auto flex flex-col md:flex-row -mt-48">
          <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
            <Fading delay={0.4} direction="up" fullWidth={null} padding={null}>
              <div className="relative flex flex-col min-w-0 wrap-break-word bg-linear-to-br from-teal-200 via-lime-300 to-green-300 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto text-slate-600">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>

                  </div>
                  <h6 className="text-xl font-semibold">Innovative Startup</h6>
                  <p className="mt-2 mb-4 text-justify text-xs">
                    Our products are designed to seamlessly integrate into your portfolio, helping you build solutions that truly meet your needs. Whether you&apos;re expanding your offerings or tailoring a product to fit a specific vision, we provide the flexibility and reliability to make it happen.
                  </p>
                </div>
              </div>
            </Fading>
          </div>
          <div className="w-full md:w-4/12 px-4 text-center">
            <Fading delay={0.6} direction="up" fullWidth={null} padding={null}>
              <div className="relative flex flex-col min-w-0 wrap-break-word bg-linear-to-t from-teal-200 via-lime-300 to-green-300 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto text-slate-600">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>

                  </div>
                  <h6 className="text-xl font-semibold">
                    Making Ideas
                  </h6>
                  <p className="mt-2 mb-4 text-justify text-xs">
                    We generate tailored ideas for your organization and align them with your business environment, ensuring solutions that truly fit your goals and aspirations. Our approach is to understand your unique challenges and opportunities, allowing us to create innovative strategies that drive success and growth for your business.
                  </p>
                </div>
              </div>
            </Fading>
          </div>
          <div className="pt-6 w-full md:w-4/12 px-4 text-center">
            <Fading delay={0.8} direction="up" fullWidth={null} padding={null}>
              <div className="relative flex flex-col min-w-0 wrap-break-word bg-linear-to-bl from-teal-200 via-lime-300 to-green-300 w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto text-slate-600">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>

                  </div>
                  <h6 className="text-xl font-semibold">
                    Verified Company
                  </h6>
                  <p className="mt-2 mb-4 text-justify text-xs">
                    We operate with transparency and integrity, giving you the confidence that your business is in safe hands. We are committed to maintaining the highest standards of professionalism and accountability in all our dealings, ensuring that your partnership with us is built on trust and reliability.
                  </p>
                </div>
              </div>
            </Fading>
          </div>
        </div>

        <div id="check-us" className="flex flex-col md:flex-row items-center mt-8">
          <div className="w-full md:w-5/12 px-4 mx-auto sm:my-16">
            <div className="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-gray-100">
              <StoreIcon className="w-8 h-8 stroke-purple-300" />
            </div>
            <h3 className="text-3xl mb-2 font-semibold leading-normal">
              Find us
            </h3>
            <p className="text-lg font-extralight leading-relaxed my-4 text-gray-600">
              Each transaction you make with us is handled with excellence. That first interaction is the foundation of a lasting partnership between our organization and yours.
            </p>
            <p className="text-lg font-extralight leading-relaxed mt-0 mb-4 text-gray-600">
              We consistently deliver results that meet your expectations — and when we exceed them, we don&apos;t ask for a refund or a top-up. Why? Because we value the relationship more than the transaction.
            </p>
            <Link
              href="/store"
              className="font-bold text-gray-800 mt-8"
            >
              Check out our store for more!
            </Link>
          </div>

          <div className="w-full md:w-4/12 px-4 mx-auto lg:mt-0 mt-16">
            <div className="relative flex flex-col min-w-0 wrap-break-word w-full mb-6 shadow-lg rounded-lg bg-pink-600">
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
                  Our ideal is to engage with our business partners the way we would with friends. We believe in openness and collaboration — you&rsquo;ll never be left wondering what happens behind the scenes. Instead, we walk alongside you throughout the entire product development journey, ensuring clarity, trust, and shared success.
                </p>
              </blockquote>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}