import { getCartCount, getUserCart } from "@/app/actions/cartActions.server";
import { auth } from "@/auth";
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

  const session = await auth();
  let count = 0;
  let cartId: string | null = null;

  if (session?.user) {
    count = await getCartCount(session.user.id);
    const cart = await getUserCart(session.user.id);
    cartId = cart?.id ?? null;
  }

  // Wrap CartStatus in a client component that listens for updates
  return (
    <div className="flex flex-col w-full px-4">

      <div className="grid md:grid-cols-3 md:gap-x-16 gap-y-8 md:px-16 mb-16 mt-16">
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
