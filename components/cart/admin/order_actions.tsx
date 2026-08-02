"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button, Dialog, DropdownMenu, Flex, Text, TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { cancelOrder, messageOrderCustomer } from "@/app/actions/merchandiseActions.server";
import { toast } from "sonner";

type Order = {
  id: string; customer: string; email: string; total: number; date: string; status: string;
  itemDetails: { title: string; quantity: number; price: number }[];
};

export default function OrderActions({ order }: { order: Order }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitMessage() {
    setBusy(true);
    try { await messageOrderCustomer(order.id, message); setMessage(""); setMessageOpen(false); toast.success("Message sent"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to send message"); }
    finally { setBusy(false); }
  }

  async function removeOrder() {
    setBusy(true);
    try { await cancelOrder(order.id); toast.success("Order cancelled"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to cancel order"); }
    finally { setBusy(false); }
  }

  return <>
    <Dialog.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
      <DropdownItem onSelect={() => setDetailsOpen(true)}>View Details</DropdownItem>
      <Dialog.Content maxWidth="480px">
        <Dialog.Title>Order summary</Dialog.Title>
        <Dialog.Description size="2" color="gray">{order.id}</Dialog.Description>
        <Flex direction="column" gap="3" mt="4">
          <Text>{order.customer} · {order.email}</Text>
          {order.itemDetails.map((item) => <Flex key={item.title} justify="between"><Text>{item.quantity} × {item.title}</Text><Text>${(item.price * item.quantity).toFixed(2)}</Text></Flex>)}
          <Flex justify="between" className="border-t pt-3"><Text weight="bold">Total</Text><Text weight="bold">${order.total.toFixed(2)}</Text></Flex>
          <Text size="2" color="gray">Status: {order.status} · {new Date(order.date).toLocaleString()}</Text>
        </Flex>
        <Flex justify="end" mt="5"><Button onClick={() => setDetailsOpen(false)}>Close</Button></Flex>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root open={messageOpen} onOpenChange={setMessageOpen}>
      <DropdownItem onSelect={() => setMessageOpen(true)}>Message Customer</DropdownItem>
      <Dialog.Content maxWidth="480px">
        <Dialog.Title>Message {order.customer}</Dialog.Title>
        <Dialog.Description size="2" color="gray">This message will continue the customer’s existing support conversation.</Dialog.Description>
        <TextArea mt="4" rows={6} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message..." />
        <Flex justify="end" gap="2" mt="4"><Button variant="soft" onClick={() => setMessageOpen(false)}>Close</Button><Button onClick={submitMessage} disabled={busy || !message.trim()}>{busy ? "Sending…" : "Send message"}</Button></Flex>
      </Dialog.Content>
    </Dialog.Root>

    <AlertDialog.Root>
      <AlertDialog.Trigger><DropdownItem color="ruby">Cancel Order</DropdownItem></AlertDialog.Trigger>
      <AlertDialog.Content><AlertDialog.Title>Cancel this order?</AlertDialog.Title><AlertDialog.Description>This removes it from the active order list and marks it as cancelled.</AlertDialog.Description><Flex justify="end" gap="2" mt="4"><AlertDialog.Cancel><Button variant="soft">Keep order</Button></AlertDialog.Cancel><AlertDialog.Action><Button color="ruby" disabled={busy} onClick={removeOrder}>Cancel order</Button></AlertDialog.Action></Flex></AlertDialog.Content>
    </AlertDialog.Root>
  </>;
}

function DropdownItem({ children, color, onSelect }: { children: React.ReactNode; color?: "ruby"; onSelect?: () => void }) {
  return (
    <DropdownMenu.Item
      color={color}
      onSelect={(event) => {
        event.preventDefault();
        onSelect?.();
      }}
    >
      {children}
    </DropdownMenu.Item>
  );
}
