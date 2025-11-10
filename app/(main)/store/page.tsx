import prisma from "@/lib/prisma";
import { GemIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const Page = async() => {

  const merchandise = await prisma.merchandise.findMany();

  return (
    <div className="flex flex-col w-full px-4">
      Content of the store
      <div className="grid md:grid-cols-3 md:gap-x-16 gap-y-8 md:px-16 mb-16 mt-8">
        {merchandise.map((item) => {
          const col = item.body.split(',');

          return <div key={item.id} className="flex flex-col min-h-[60vh] justify-between p-4 bg-slate-500 text-gray-100 rounded-lg">
            <div className="flex items-start justify-start gap-x-8">
              <GemIcon className="h-6 w-6" />
              <h3 className="text-xl font-semibold uppercase">{item.title}</h3>
            </div>
            <ul className="list-outside ml-4">
              {col.map((str, index) => (
                <li key={index} className="list-disc text-xs capitalize">
                  {str} 
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold">
              ${item.price}.00
            </p>
          </div>
        })}
      </div>
    </div>
  );
}

export default Page;
