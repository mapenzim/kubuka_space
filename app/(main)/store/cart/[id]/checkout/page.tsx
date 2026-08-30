import {
  getDiscountedUnitPrice,
  getLineDiscount,
} from "@/lib/pricing";
import { auth } from "@/auth";
import CheckoutForm from "@/components/cart/components/checkout_form";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Box, Flex, Heading, Text, Separator, Card } from "@radix-ui/themes";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function validateCartId(id: string): string {
  if (!id || typeof id !== "string") {
    notFound();
  }
  return id;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const cartId = validateCartId(id);
  const session = await auth();

  // 🔐 Require auth
  if (!session?.user) {
    redirect(`/authentication?callbackUrl=/store/cart/${cartId}/checkout`);
  }

  // ✅ Fetch cart correctly
  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      userId: session.user.id,
    },
    include: {
      cartItems: {
        include: {
          merchandise: true,
        },
      },
    },
  });

  if (!cart) return notFound();

  const isEmpty = cart.cartItems.length === 0;

  if (isEmpty) {
    redirect("/store"); // no checkout for empty carts
  }

  /**
   * ---------------------------
   * Totals (Backwards VAT Calculation)
   * ---------------------------
   */
  // DB Price is INCLUSIVE of 15% VAT
  const inclusiveSubtotal = cart.cartItems.reduce((sum: number, item: { quantity: any; merchandise: { price: any; }; }) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.merchandise?.price) || 0;
    return sum + quantity * price;
  }, 0);

  const VAT_RATE = 0.15;
  const exclusiveSubtotal = inclusiveSubtotal / (1 + VAT_RATE);
  const vat = inclusiveSubtotal - exclusiveSubtotal;
  
  const discount = cart.cartItems.reduce((sum, item) => {
    return sum + getLineDiscount(
      Number(item.merchandise?.price) || 0,
      Number(item.quantity) || 0,
    );
  }, 0);
  const total = Math.max(0, inclusiveSubtotal - discount);

  return (
    <Box className="min-h-screen bg-white dark:bg-zinc-950 px-6 py-16 transition-colors duration-200 flex justify-center">
      <Box className="w-full max-w-3xl">
        
        {/* 🧾 Order Summary Box */}
        <Card size="4" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
          <Heading as="h2" size="5" weight="bold" mb="4" className="text-zinc-900 dark:text-zinc-100">
            Order Summary
          </Heading>

          <Box className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-800">
            
            {/* Items List */}
            <Flex direction="column" className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {cart.cartItems.map((item) => (
                <Flex key={item.id} justify="between" align="center" p="4">
                  <Box>
                    <Text as="div" size="2" weight="medium" className="text-zinc-700 dark:text-zinc-300">
                      Item ref: <Text className="text-orange-500 dark:text-orange-400">{item.id.slice(-6).toUpperCase()}</Text>
                    </Text>
                    <Text as="div" size="2" color="gray">
                      Qty: {item.quantity}
                    </Text>
                  </Box>

                  <Box className="text-right">
                    <Text as="div" size="3" weight="medium" className="capitalize text-zinc-900 dark:text-zinc-100">
                      {item.merchandise?.title}
                    </Text>
                    <Flex justify="end" align="center" gap="2">
                      {getLineDiscount(Number(item.merchandise?.price) || 0, 1) > 0 && (
                        <Text as="span" size="1" color="gray" className="line-through">
                          ${Number(item.merchandise?.price || 0).toFixed(2)}
                        </Text>
                      )}
                      <Text as="span" size="2" color="gray">
                        ${getDiscountedUnitPrice(Number(item.merchandise?.price) || 0).toFixed(2)}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              ))}
            </Flex>

            {/* Totals Section */}
            <Box className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-t border-zinc-200 dark:border-zinc-700">
              <Flex direction="column" gap="2" className="ml-0 sm:ml-16">
                
                <Flex justify="between" className="pr-4">
                  <Text size="2" weight="medium" className="text-zinc-700 dark:text-zinc-400">Subtotal (Excl. VAT)</Text>
                  <Text size="2" className="text-zinc-900 dark:text-zinc-300">${exclusiveSubtotal.toFixed(2)}</Text>
                </Flex>

                <Flex justify="between" className="pr-4">
                  <Text size="2" weight="medium" className="text-zinc-700 dark:text-zinc-400">VAT (15%)</Text>
                  <Text size="2" className="text-zinc-900 dark:text-zinc-300">${vat.toFixed(2)}</Text>
                </Flex>

                {discount > 0 && (
                  <Flex justify="between" className="pr-4">
                    <Text size="2" weight="medium" className="text-zinc-700 dark:text-zinc-400">Eligible product discount</Text>
                    <Text size="2" className="text-zinc-900 dark:text-zinc-300">- ${discount.toFixed(2)}</Text>
                  </Flex>
                )}

                <Separator size="4" my="2" className="bg-zinc-300 dark:bg-zinc-600 w-full" />

                <Flex justify="between" align="center" className="pr-4">
                  <Text size="4" weight="bold" className="text-zinc-900 dark:text-zinc-100">Total</Text>
                  <Text size="4" weight="bold" className="text-zinc-900 dark:text-zinc-100 underline decoration-2 underline-offset-2">
                    ${total.toFixed(2)}
                  </Text>
                </Flex>

              </Flex>
            </Box>
          </Box>
        </Card>

        {/* 💳 Checkout Component */}
        <Box>
          <CheckoutForm cartId={cart.id} />
        </Box>

      </Box>
    </Box>
  );
}
