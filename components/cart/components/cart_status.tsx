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
  Badge,
} from "@radix-ui/themes";
import { CartItem } from "@/lib/interfaces";
import { ShoppingCartIcon, Trash2 } from "lucide-react";

export default function CartStatus({ isScrolled }: { isScrolled: boolean }) {
  const { cartCountTotal, cartId, cart, removeItem } = useCart();
  const { status } = useSession();

  // Cart trigger with badge overlay
  const CartTrigger = () => (
    <Box position="relative" display="inline-block" style={{ cursor: "pointer" }}>
      <ShoppingCartIcon
        size={32}
        className={isScrolled ? "text-gray-700 dark:text-gray-300" : "text-white dark:text-gray-300"}
      />
      {cartCountTotal > 0 && (
        <Badge
          size="1"
          radius="full"
          color="red"
          variant="solid"
          style={{
            position: "absolute",
            top: -4,
            right: -4,
          }}
        >
          {cartCountTotal}
        </Badge>
      )}
    </Box>
  );

  // 1. Empty cart
  if (cartCountTotal === 0) {
    return (
      <Box aria-label="Empty shopping cart">
        <CartTrigger />
      </Box>
    );
  }

  // 2. Authenticated user with items
  if (status === "authenticated") {
    return (
      <Link href={`/store/cart/${cartId}`} passHref>
        <CartTrigger />
      </Link>
    );
  }

  // 3. Guest user with items
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <span tabIndex={0} style={{ display: "inline-block", outline: "none" }}>
          <CartTrigger />
        </span>
      </HoverCard.Trigger>

      <HoverCard.Content 
        size="2" 
        maxWidth="320px" 
        side="bottom" 
        align="end"
        style={{ maxHeight: "520px" }}
      >
        <Flex direction="column" gap="3">
          <Text as="div" size="2" weight="bold">
            Your Cart
          </Text>

          {/* Item List with Delete buttons */}
          <Flex direction="column" gap="2" style={{ maxHeight: "480px", overflowY: "auto" }}>
            {cart.cartItems.length > 0 ? (
              cart?.cartItems?.map((item: CartItem) => (
                <Flex key={item.id} justify="between" align="center">
                  <Text as="div" size="1" color="gray" truncate>
                    {item.merchandise?.title || `Item`} x {item.quantity}
                  </Text>
                  <Button
                    variant="ghost"
                    color="red"
                    size="1"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.merchandise?.title}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </Flex>
              ))
            ) : (
              <Text as="div" size="1" color="gray">
                {cartCountTotal} item{cartCountTotal > 1 ? "s" : ""} in cart
              </Text>
            )}
          </Flex>

          {/* Auth Redirect */}
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
