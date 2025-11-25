import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const Page = async ({ params }: {params: Promise<{ id: string }>}) => {
  const { id } = await params;
  const cart = await prisma.cart.findFirst({
    where: { merchandiseId: parseInt(id) },
    include: { merchandise: true }
  });

  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex justify-between items-center mt-4 mb-8">
        <h2 className="text-2xl font-bold">Items in the cart</h2>
      </div>

      <div className="grid md:grid-cols-3 md:gap-x-16 gap-y-8 md:px-16 mb-16 mt-8">
        <p>{cart?.merchandise.title}</p>
      </div>
    </div>
  );
};

export default Page;
