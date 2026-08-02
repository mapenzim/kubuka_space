import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Table, 
  Badge, 
  Box, 
  Card,
  Tabs,
  DropdownMenu,
  IconButton,
  Avatar
} from "@radix-ui/themes";
import MerchandiseManager from "@/components/cart/admin/merchandise_manager";
import { getOrdersForAdmin } from "@/app/actions/merchandiseActions.server";
import OrderActions from "@/components/cart/admin/order_actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/roles";
import { StoreProductProvider } from "@/components/cart/admin/store_product_context";
import StoreProductAddButton from "@/components/cart/admin/store_product_add_button";

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(dateString));
};

export default async function AdminStorePage() {
  // Check again at the page boundary so logout cannot start the data query
  // while the admin layout is transitioning away.
  const session = await auth();
  if (!session?.user) redirect("/authentication?callbackUrl=/admin/store");
  if (!isAdminRole(session.user.role)) redirect("/");

  const orders = await getOrdersForAdmin();
  
  // 2. Reusable Table Component to prevent repeating code across 4 tabs
  const OrderTable = ({ filterStatus }: { filterStatus: string }) => {
    const filteredOrders = orders.filter(order => order.status === filterStatus);

    if (filteredOrders.length === 0) {
      return (
        <Flex align="center" justify="center" p="6" className="text-gray-500 border-2 border-dashed border-(--gray-a6) rounded-lg">
          <Text>No items currently in this category.</Text>
        </Flex>
      );
    }

    return (
      <Card size="2" variant="surface" className="overflow-hidden mt-4">
        <Box className="overflow-x-auto">
          <Table.Root variant="surface" size="3">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Items</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredOrders.map((order) => (
                <Table.Row key={order.id} align="center">
                  <Table.RowHeaderCell>
                    <Text weight="bold" size="2">{order.id}</Text>
                  </Table.RowHeaderCell>
                  
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Avatar size="1" fallback={order.customer.charAt(0)} color="indigo" radius="full" />
                      <Box>
                        <Text as="div" size="2" weight="medium">{order.customer}</Text>
                        <Text as="div" size="1" color="gray">{order.email}</Text>
                      </Box>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell><Text size="2" color="gray">{order.items}</Text></Table.Cell>
                  <Table.Cell><Text size="2" weight="bold">${order.total.toFixed(2)}</Text></Table.Cell>
                  <Table.Cell><Text size="2" color="gray">{formatDate(order.date)}</Text></Table.Cell>

                  <Table.Cell align="right">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" color="gray" size="2" style={{ cursor: "pointer" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                          </svg>
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content size="2" align="end">
                        <OrderActions order={order} />
                        <DropdownMenu.Separator />
                        {filterStatus === "paid" && <DropdownMenu.Item color="grass">Mark as Shipped</DropdownMenu.Item>}
                        {filterStatus === "cart" && <DropdownMenu.Item>Send Recovery Email</DropdownMenu.Item>}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card>
    );
  };

  return (
    <StoreProductProvider>
    <Flex direction="column" gap="5">
      
      {/* Page Header */}
      <Flex justify="between" align="center" wrap="wrap" gap="3">
        <Box>
          <Heading as="h1" size="6" mb="1">Storefront & Orders</Heading>
          <Text color="gray" size="2">Manage customer carts, payments, and fulfillments.</Text>
        </Box>
        <Flex gap="3">
          <Button size="3" variant="soft" color="gray" style={{ cursor: "pointer" }}>
            Export CSV
          </Button>
          <StoreProductAddButton />
        </Flex>
      </Flex>

      <MerchandiseManager />

      {/* 3. The Tabs Component managing the categories */}
      <Tabs.Root defaultValue="paid" className="bg-sky-900 rounded-b-md">
        <Tabs.List size="2">
          <Tabs.Trigger value="pending" style={{ cursor: "pointer", color: "var(--gray-2)" }}>
            Pending
            <Badge size="1" color="orange" variant="solid" radius="full" className="ml-2">{orders.filter((order) => order.status === "pending").length}</Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="paid" style={{ cursor: "pointer", color: "var(--gray-2)" }}>
            Paid
            <Badge size="1" color="indigo" variant="solid" radius="full" className="ml-2">{orders.filter((order) => order.status === "paid").length}</Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="shipped" style={{ cursor: "pointer", color: "var(--gray-2)" }}>
            Shipped
          </Tabs.Trigger>
          <Tabs.Trigger value="delivered" style={{ cursor: "pointer", color: "var(--gray-2)" }}>
            Delivered
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="2">
          <Tabs.Content value="pending">
            <OrderTable filterStatus="pending" />
          </Tabs.Content>
          
          <Tabs.Content value="paid">
            <OrderTable filterStatus="paid" />
          </Tabs.Content>
          
          <Tabs.Content value="shipped">
            <OrderTable filterStatus="shipped" />
          </Tabs.Content>
          <Tabs.Content value="delivered">
            <OrderTable filterStatus="delivered" />
          </Tabs.Content>
        </Box>
      </Tabs.Root>

    </Flex>
    </StoreProductProvider>
  );
}
