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
  Avatar
} from "@radix-ui/themes";
import MerchandiseManager from "@/components/cart/admin/merchandise_manager";
import { getAdminStoreData } from "@/app/actions/merchandiseActions.server";
import OrderActions from "@/components/cart/admin/order_actions";
import { StoreProductProvider } from "@/components/cart/admin/store_product_context";
import StoreProductAddButton from "@/components/cart/admin/store_product_add_button";

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(dateString));
};

type AdminOrder = Awaited<ReturnType<typeof getAdminStoreData>>["orders"][number];

function OrderTable({
  orders,
  filterStatus,
}: {
  orders: AdminOrder[];
  filterStatus: string;
}) {
  const filteredOrders = orders.filter(
    (order) => order.status === filterStatus,
  );

  if (filteredOrders.length === 0) {
    return (
      <Flex
        align="center"
        justify="center"
        p="6"
        className="rounded-lg border-2 border-dashed border-(--gray-a6) text-gray-500"
      >
        <Text>No items currently in this category.</Text>
      </Flex>
    );
  }

  return (
    <Card size="2" variant="surface" className="mt-4 overflow-hidden">
      <Box className="overflow-x-auto">
        <Table.Root variant="surface" size="3">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Items</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                Actions
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredOrders.map((order) => (
              <Table.Row key={order.id} align="center">
                <Table.RowHeaderCell>
                  <Text weight="bold" size="2">
                    {order.id}
                  </Text>
                </Table.RowHeaderCell>

                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Avatar
                      size="1"
                      fallback={order.customer.charAt(0)}
                      color="indigo"
                      radius="full"
                    />
                    <Box>
                      <Text as="div" size="2" weight="medium">
                        {order.customer}
                      </Text>
                      <Text as="div" size="1" color="gray">
                        {order.email}
                      </Text>
                    </Box>
                  </Flex>
                </Table.Cell>

                <Table.Cell>
                  <Text size="2" color="gray">
                    {order.items}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" weight="bold">
                    ${order.total.toFixed(2)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" color="gray">
                    {formatDate(order.date)}
                  </Text>
                </Table.Cell>
                <Table.Cell align="right">
                  <OrderActions order={order} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Card>
  );
}

export default async function AdminStorePage() {
  const { orders, products, categories } = await getAdminStoreData();

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

      <MerchandiseManager
        initialProducts={products}
        initialCategories={categories}
      />

      {/* 3. The Tabs Component managing the categories */}
      <Tabs.Root defaultValue="paid" className="admin-tabs rounded-b-md">
        <Tabs.List size="2" className="overflow-x-auto">
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
            <OrderTable orders={orders} filterStatus="pending" />
          </Tabs.Content>
          
          <Tabs.Content value="paid">
            <OrderTable orders={orders} filterStatus="paid" />
          </Tabs.Content>
          
          <Tabs.Content value="shipped">
            <OrderTable orders={orders} filterStatus="shipped" />
          </Tabs.Content>
          <Tabs.Content value="delivered">
            <OrderTable orders={orders} filterStatus="delivered" />
          </Tabs.Content>
        </Box>
      </Tabs.Root>

    </Flex>
    </StoreProductProvider>
  );
}
