/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";

const Blogcard = ({ article }: Readonly<{article: any}>) => {
  return (
    <article className="lg:col-span-1 col-span-2 flex flex-row bg-white transition hover:shadow-xl">
      <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
        <time
          dateTime="2022-10-10"
          className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
        >
          <span>{article?.date.slice(-4,)}</span>
          <span className="w-px flex-1 bg-gray-900/10"></span>
          <span>{article?.date.slice(0, -4)}</span>
        </time>
      </div>

      <div className="hidden sm:block sm:basis-56">
        <Image
          alt="Guitar"
          src={"/images/victoria-falls.png"}
          className="aspect-square h-full w-full object-cover"
          width={32}
          height={32}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
          <Link href={article?.title.toLowerCase().split(" ").join('-').split("'").join("-")}>
            <h3 className="hidden lg:flex font-normal uppercase text-gray-900">
              {article?.title}
            </h3>
            <h5 className="flex lg:hidden font-normal uppercase text-gray-900">
              {article?.title}
            </h5>
          </Link>

          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
            {article?.content}
          </p>
        </div>

        <div className="sm:flex sm:items-end sm:justify-end">
          <Link href={article?.title.toLowerCase().split(" ").join('-').split("'").join("-")}
            className="block bg-yellow-300 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
          >
            Read Blog
          </Link>
        </div>
      </div>
    </article>
  );
}

export { Blogcard };