export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center pt-8">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto size-20 text-gray-400 dark:text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path>
      </svg>

      <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Out of stock</h2>

      <p className="mt-4 text-pretty text-gray-700 dark:text-gray-200">
        This item is currently unavailable. Check back soon or explore similar products.
      </p>

      <div className="mt-6 space-y-2">
        <a href="#" className="block w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          Notify When Available
        </a>

        <a href="#" className="block w-full rounded-lg border border-indigo-600 px-6 py-3 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-800">
          Explore Similar Products
        </a>
      </div>

      <p className="mt-6 text-sm text-gray-700 dark:text-gray-200">
        Last restocked: <span className="font-medium"> 3 weeks ago </span>
      </p>
    </div>
  );
}
