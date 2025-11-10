"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Notfound() {
  const router = useRouter();

  return (
    <main className="mt-12">
      <div className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="">
            <h2 className="text-base text-orange-400 font-semibold tracking-wide uppercase">404 Error</h2>
            <p className="mt-2 md:text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-xl">
              Page not found
            </p>
            <p className="mt-4 max-w-2xl text-sm text-gray-500">
              Check the URL again, or maybe come back latter.
            </p>
          </div>
        </div>
      </div>
      <section className="relative block py-24 md:pt-0 bg-white">
        <div className="container mx-auto px-64">
          <div className="flex-auto rounded-lg w-50 shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="text-justify">
              <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                <h3 className="text-sm tracking-wide font-medium text-gray-500 uppercase">Popular Pages</h3>
                <Link
                  href='/posts'
                  className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 border-b-2 border-gray-100"
                >
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900">Blog</p>
                    <p className="mt-1 text-sm text-gray-500">Read articles</p>
                  </div>
                </Link>
                {/* add more quick menus here */}
                <button
                  className="bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 text-white active:bg-gray-700 text-sm font-bold uppercase py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none my-1 hover:bg-gradient-to-l duration-600 cursor-pointer"
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
      </section>
    </main>
  );
}
