import prisma from "@/lib/prisma";
import Link from "next/link";
import { ReactNode } from "react";

type CheckoutLinkProps = {
  params: { id: string };
  children: ReactNode;
};

export async function CheckoutLink({ params, children }: CheckoutLinkProps) {
  const { id } = params;

  // If you want to fetch cart data, uncomment:
  /*
  const cart = await prisma.cart.findUnique({
    where: { id: parseInt(id) },
  });
  */

  return (
    <Link href={`/store/cart/${id}/checkout`}>
      {children}
    </Link>
  );
}
