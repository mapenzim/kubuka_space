"use client";

import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  HoverCard, 
  Button, 
  Flex, 
  Text, 
  Box, 
  Badge 
} from "@radix-ui/themes";
import { CartItem } from "@/lib/interfaces";

export default function CartStatus({ isScrolled }: { isScrolled: boolean }) {
  const { cartCount, cartId, cart } = useCart();
  const { status } = useSession();

  // Reusable Cart Icon 
  const CartIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isScrolled ? "text-gray-700 dark:text-gray-300" : "text-white dark:text-gray-300"}
    >
      <path
        d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Reusable Trigger (Icon + Radix Badge)
  const CartTrigger = () => (
    <Box position="relative" display="inline-block" style={{ cursor: "pointer" }}>
      <CartIcon />
      {cartCount > 0 && (
        <Box position="absolute" style={{ top: -8, right: -12 }}>
          <Badge size="1" radius="full" color="indigo" variant="solid">
            {cartCount}
          </Badge>
        </Box>
      )}
    </Box>
  );

  // 1. If cart is empty, just render the plain icon
  if (cartCount === 0) {
    return (
      <Box aria-label="Empty shopping cart">
        <CartTrigger />
      </Box>
    );
  }

  // 2. If logged in and has items, render the standard link to the cart
  if (status === "authenticated") {
    return (
      <Link href={`/store/cart/${cartId}`} passHref>
        <a aria-label="Shopping cart">
          <CartTrigger />
        </a>
      </Link>
    );
  }

  // 3. If NOT logged in and has items, render the Radix HoverCard
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        {/* We wrap the trigger in a span so it can receive focus for keyboard accessibility */}
        <span tabIndex={0} style={{ display: "inline-block", outline: "none" }}>
          <CartTrigger />
        </span>
      </HoverCard.Trigger>

      <HoverCard.Content size="2" maxWidth="280px" side="bottom" align="end">
        <Flex direction="column" gap="3">
          <Text as="div" size="2" weight="bold">
            Your Cart
          </Text>

          {/* Item List */}
          <Flex direction="column" gap="1" style={{ maxHeight: "140px", overflowY: "auto" }}>
            {cart?.cartItems?.length > 0 ? (
              cart?.cartItems?.map((item: CartItem) => (
                <Text key={item.id} as="div" size="1" color="gray" truncate>
                  • {item.merchandise?.title || `Item ${item.quantity + 1}`}
                </Text>
              ))
            ) : (
              <Text as="div" size="1" color="gray">
                {cartCount} item{cartCount > 1 ? "s" : ""} in cart
              </Text>
            )}
          </Flex>

          {/* Auth Redirect Button leveraging Radix 'asChild' to render as a Next.js Link */}
          <Button asChild color="indigo" variant="solid" size="2">
            <Link href={`/authentication?callbackUrl=/store/cart/${cartId}`}>
              Sign in to checkout
            </Link>
          </Button>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}