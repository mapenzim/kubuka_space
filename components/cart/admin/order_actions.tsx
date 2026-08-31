"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Dialog,
  DropdownMenu,
  Flex,
  IconButton,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "sonner";

import {
  cancelOrder,
  messageOrderCustomer,
} from "@/app/actions/merchandiseActions.server";
import AdminDialogButton from "@/components/admin/AdminDialogButton";

type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  date: string;
  status: string;
  itemDetails: {
    title: string;
    quantity: number;
    price: number;
  }[];
};

export default function OrderActions({ order }: { order: Order }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitMessage() {
    setBusy(true);

    try {
      await messageOrderCustomer(order.id, message);
      setMessage("");
      setMessageOpen(false);
      toast.success("Message sent");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send message",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeOrder() {
    setBusy(true);

    try {
      await cancelOrder(order.id);
      setCancelOpen(false);
      toast.success("Order cancelled");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to cancel order",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton
            variant="ghost"
            color="gray"
            size="2"
            aria-label={`Actions for order ${order.id}`}
            className="cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content size="2" align="end">
          <DropdownMenu.Item onSelect={() => setDetailsOpen(true)}>
            View Details
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => setMessageOpen(true)}>
            Message Customer
          </DropdownMenu.Item>
          <DropdownMenu.Item color="ruby" onSelect={() => setCancelOpen(true)}>
            Cancel Order
          </DropdownMenu.Item>

          {order.status === "paid" && (
            <>
              <DropdownMenu.Separator />
              <DropdownMenu.Item color="grass">
                Mark as Shipped
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <Dialog.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <Dialog.Content
          maxWidth="480px"
          className="bg-white! text-zinc-900 dark:bg-zinc-900! dark:text-zinc-100"
        >
          <Dialog.Title>Order summary</Dialog.Title>
          <Dialog.Description size="2" color="gray">
            {order.id}
          </Dialog.Description>
          <Flex direction="column" gap="3" mt="4">
            <Text>
              {order.customer} · {order.email}
            </Text>
            {order.itemDetails.map((item) => (
              <Flex key={item.title} justify="between">
                <Text>
                  {item.quantity} × {item.title}
                </Text>
                <Text>${(item.price * item.quantity).toFixed(2)}</Text>
              </Flex>
            ))}
            <Flex justify="between" className="border-t pt-3">
              <Text weight="bold">Total</Text>
              <Text weight="bold">${order.total.toFixed(2)}</Text>
            </Flex>
            <Text size="2" color="gray">
              Status: {order.status} · {new Date(order.date).toLocaleString()}
            </Text>
          </Flex>
          <Flex justify="end" mt="5">
            <AdminDialogButton
              type="button"
              variant="secondary"
              onClick={() => setDetailsOpen(false)}
            >
              Close
            </AdminDialogButton>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={messageOpen} onOpenChange={setMessageOpen}>
        <Dialog.Content
          maxWidth="480px"
          className="bg-white! text-zinc-900 dark:bg-zinc-900! dark:text-zinc-100"
        >
          <Dialog.Title>Message {order.customer}</Dialog.Title>
          <Dialog.Description size="2" color="gray">
            This message will continue the customer’s existing support
            conversation.
          </Dialog.Description>
          <TextArea
            mt="4"
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message..."
          />
          <Flex justify="end" gap="2" mt="4">
            <AdminDialogButton
              type="button"
              variant="secondary"
              onClick={() => setMessageOpen(false)}
            >
              Close
            </AdminDialogButton>
            <AdminDialogButton
              type="button"
              onClick={submitMessage}
              disabled={busy || !message.trim()}
            >
              {busy ? "Sending…" : "Send message"}
            </AdminDialogButton>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <AlertDialog.Root
        open={cancelOpen}
        onOpenChange={(open) => {
          if (!busy) setCancelOpen(open);
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="AlertDialogOverlay" />
          <AlertDialog.Content className="AlertDialogContent dark:bg-gray-900! dark:ring-1! dark:ring-orange-400!">
            <AlertDialog.Title className="AlertDialogTitle dark:text-zinc-300!">
              Cancel this order?
            </AlertDialog.Title>
            <AlertDialog.Description className="AlertDialogDescription">
              This removes it from the active order list and marks it as
              cancelled.
            </AlertDialog.Description>
            <Flex justify="end" gap="2" mt="4">
              <AlertDialog.Cancel asChild>
                <AdminDialogButton
                  type="button"
                  variant="secondary"
                  disabled={busy}
                >
                  Keep order
                </AdminDialogButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <AdminDialogButton
                  type="button"
                  variant="danger"
                  disabled={busy}
                  onClick={(event) => {
                    event.preventDefault();
                    void removeOrder();
                  }}
                >
                  {busy ? "Cancelling…" : "Cancel order"}
                </AdminDialogButton>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
