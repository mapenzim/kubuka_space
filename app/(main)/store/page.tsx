import MerchandiseCard from "@/components/cart/components/merchandise_card";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const Page = async () => {
  const merchandise = await prisma.merchandise.findMany();
  const minifiedMerchandise = merchandise.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    price: Number(item.price),
  }));

  // Wrap CartStatus in a client component that listens for updates
  return (
    <div className="flex flex-col w-full px-4 mb-16">

      <div className="grid md:grid-cols-3 gap-y-4 md:gap-x-16 md:gap-y-8 md:px-16 md:my-16">
        {minifiedMerchandise.map((item) => (
          <MerchandiseCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
