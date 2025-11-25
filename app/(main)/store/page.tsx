import prisma from "@/lib/prisma";
import CartStatus from "../../../components/cart/components/cart_status";
import MerchandiseCard from "../../../components/cart/components/merchandise_card";

export const dynamic = "force-dynamic";

const Page = async () => {
  const merchandise = await prisma.merchandise.findMany();

  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex justify-between items-center mt-4 mb-8">
        <h2 className="text-2xl font-bold">Content of the Store</h2>
        <CartStatus />
      </div>

      <div className="grid md:grid-cols-3 md:gap-x-16 gap-y-8 md:px-16 mb-16 mt-8">
        {merchandise.map((item) => (
          <MerchandiseCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Page;
