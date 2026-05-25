import { CartButtons, CheckoutBtn } from "@/components/buttons/cart-btns";
import prisma, { serializeDecimal } from "@/lib/prisma";
import { DISCOUNT } from "@/lib/utils"; // Removed VAT import since it's hardcoded to 15% backwards
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container, Box, Flex, Heading, Text, Separator } from "@radix-ui/themes";
import { toast } from "sonner";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

/**
 * ---------------------------
 * Types
 * ---------------------------
 */
interface Merchandise {
  title: string;
  price: number;
}

interface CartItem {
  id: string;
  quantity: number;
  merchandise: Merchandise;
}

type Params = { id: string };

type PageProps = {
  params: Promise<Params>;
};

/**
 * ---------------------------
 * Helpers
 * ---------------------------
 */
function validateCartId(id: string): string {
  if (!id) notFound();
  return id;
}

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

/**
 * ---------------------------
 * Page
 * ---------------------------
 */
export default async function Page({ params }: PageProps) {
  const cartId = validateCartId((await params)?.id);

  // 1. Fetch Cart
  const cart = await prisma.cart.findFirst({
    where: { id: cartId },
    include: {
      cartItems: {
        include: { merchandise: true },
      },
    },
  });

  if (!cart) notFound();

  // 2. Validate Cart Ownership (Redirect if it belongs to someone else)
  const session = await auth(); // Placeholder

  const safeCart = serializeDecimal(cart);
  const items: CartItem[] = safeCart.cartItems;
  const isEmpty = items.length === 0;

  /**
   * ---------------------------
   * Totals (Backwards VAT Calculation)
   * ---------------------------
   */
  // DB Price is INCLUSIVE of 15% VAT
  const inclusiveSubtotal = items.reduce((sum, item) => {
    const qty = toNumber(item.quantity);
    const price = toNumber(item.merchandise?.price); 
    return sum + qty * price;
  }, 0);

  const VAT_RATE = 0.15;
  const exclusiveSubtotal = inclusiveSubtotal / (1 + VAT_RATE);
  const vat = inclusiveSubtotal - exclusiveSubtotal;
  
  const discount = DISCOUNT;
  const total = Math.max(0, inclusiveSubtotal - discount);

  if (cart.userId && cart.userId !== session?.user?.id) {
    // toast.error("You do not have access to this cart. Redirecting to store...");
    redirect("/store");
  }

  if (!session?.user) { return redirect('/store'); }

  return (
    // Added min-h-screen and explicit dark mode backgrounds to the root wrapper
    <Box className="w-full min-h-screen px-6 md:px-16 lg:px-16 xl:px-32 py-12 dark:bg-transparent! transition-colors duration-200">
      <Container size="4">
        
        {/* Header */}
        <Box mb="6">
          <Heading as="h1" size={{ initial: '4', md: "8"}} color="gray" className="dark:text-zinc-400!" highContrast>
            Your Cart
          </Heading>
        </Box>

        {/* Body */}
        <Flex direction="column" gap="6">

          {/* ITEMS */}
          {!isEmpty ? (
            <Flex direction="column" gap="2" className="w-full max-w-7xl">
              {items.map((item) => (
                <Flex
                  key={item.id}
                  align="center"
                  justify="between"
                  gap="6"
                  // Replaced Radix alpha colors with explicit Tailwind dark variants for bulletproof styling
                  className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 rounded-sm"
                >
                  <CartButtons item={item} />

                  <Flex flexGrow="1" align="center" justify="between">
                    <Text size="3" weight="medium" className="capitalize text-zinc-900 dark:text-indigo-400">
                      {item.merchandise.title}
                    </Text>

                    <Text size="2" color="gray" className="dark:text-indigo-500!">
                      ${toNumber(item.merchandise.price).toFixed(2)}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Text color="gray" size="3" className=" text-indigo-600! dark:text-indigo-400!">
              Empty cart — let’s go{" "}
              {/* Added dark:text and dark:hover for the link */}
              <Link 
                href="/store" 
                className="inline-flex items-center gap-1 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
              >
                shopping <LinkIcon className="w-4 h-4" />
              </Link>
            </Text>
          )}

          {/* TOTALS */}
          {!isEmpty && (
            <Flex justify="end" pt="6">
              <Flex direction="column" gap="4" className="w-full max-w-lg">
                
                <Flex direction="column" gap="2">
                  <Flex justify="between">
                    <Text size="3" color="gray" className="dark:text-zinc-400!">Subtotal (Excl. VAT)</Text>
                    <Text size="3" color="gray" className="dark:text-zinc-400!">${exclusiveSubtotal.toFixed(2)}</Text>
                  </Flex>

                  <Flex justify="between">
                    <Text size="3" color="gray" className="dark:text-zinc-400!">VAT (15%)</Text>
                    <Text size="3" color="gray" className="dark:text-zinc-400!">${vat.toFixed(2)}</Text>
                  </Flex>

                  <Flex justify="between">
                    <Text size="3" color="gray" className="dark:text-zinc-400!">Discount</Text>
                    <Text size="3" color="gray" className="dark:text-zinc-400!">- ${discount.toFixed(2)}</Text>
                  </Flex>

                  {/* Radix Separator automatically handles dark mode via the Theme provider */}
                  <Separator size="4" my="2" className="bg-zinc-200 dark:bg-zinc-800" />

                  <Flex justify="between" align="center">
                    <Text size="4" weight="bold" className="dark:text-zinc-400!" highContrast>Total</Text>
                    <Text size="4" weight="bold" className="dark:text-zinc-400!" highContrast>${total.toFixed(2)}</Text>
                  </Flex>
                </Flex>

                <Box mt="2">
                  <CheckoutBtn isEmpty={isEmpty} cartId={cartId} />
                </Box>
                
              </Flex>
            </Flex>
          )}

        </Flex>
      </Container>
    </Box>
  );
}