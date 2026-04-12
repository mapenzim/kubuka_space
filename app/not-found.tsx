"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const popular = [
  {
    link: "posts",
    title: "Blog",
    description: "Read articles"
  },
  {
    link: "store",
    title: "Products",
    description: "Browse our products"
  }
];

export default function Notfound() {
  const router = useRouter();

  return (
    <div className="mt-16 dark:bg-slate-950">
      <div className="py-12 ">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="">
            <h2 className="text-base text-orange-400 dark:text-orange-400/70 font-semibold tracking-wide uppercase">404 Error</h2>
            <p className="mt-2 md:text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-zinc-400 sm:text-xl">
              Page not found
            </p>
            <p className="mt-4 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Check the URL again, or maybe come back latter.
            </p>
          </div>
        </div>
      </div>
      <div className="relative block pb-20 md:py-24 md:pt-0 ">
        <div className="container px-4">
          <div className="flex-auto rounded-lg w-64 md:w-150 mx-auto shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="">
              <div className="relative grid gap-6 bg-white dark:bg-slate-700 px-5 py-6 sm:gap-8 sm:p-8">
                <h3 className="text-sm tracking-wide font-medium text-gray-500 dark:text-zinc-400 uppercase">Popular Pages</h3>
                {/** Popular links */}
                {
                  popular.map((ln) => 
                    <Link
                      key={ln.link}
                      href={ln.link}
                      className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 border-b-2 border-gray-100"
                    >
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900 dark:text-zinc-400">
                          {ln.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-500">
                          {ln.description}
                        </p>
                      </div>
                    </Link>
                  )
                }
                {/* add more quick menus here */}
                <button
                  className="bg-linear-to-r from-indigo-600 via-blue-500 to-purple-500 text-white active:bg-gray-700 text-sm font-bold uppercase py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none my-1 hover:bg-linear-to-l duration-600 cursor-pointer"
                  type="button"
                  onClick={() => router.back()}
                >
                  &larr;
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
