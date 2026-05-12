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

// 1. Mock Data covering all your requested categories
const MOCK_ORDERS = [
  { id: "ORD-001", customer: "Tariro Ndlovu", email: "tariro@example.com", items: "2x Kubuka T-Shirt", total: "$45.00", date: "2026-05-03T10:30:00Z", status: "cart" },
  { id: "ORD-002", customer: "Jane Doe", email: "jane@example.com", items: "1x Premium E-Book", total: "$15.00", date: "2026-05-02T14:15:00Z", status: "checkout" },
  { id: "ORD-003", customer: "John Smith", email: "john@example.com", items: "1x Annual Subscription", total: "$120.00", date: "2026-05-01T09:00:00Z", status: "paid" },
  { id: "ORD-004", customer: "Alice Johnson", email: "alice@example.com", items: "3x Sticker Pack", total: "$12.00", date: "2026-05-01T16:45:00Z", status: "paid" },
  { id: "ORD-005", customer: "Bob Martin", email: "bob@example.com", items: "1x Digital Course", total: "$99.00", date: "2026-04-28T11:20:00Z", status: "fulfilled" },
  { id: "ORD-006", customer: "Sarah Connor", email: "sarah@example.com", items: "1x Hoodie (Black, M)", total: "$65.00", date: "2026-04-25T08:10:00Z", status: "fulfilled" },
];

// Helper to format dates
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(dateString));
};

export default function AdminStorePage() {
  
  // 2. Reusable Table Component to prevent repeating code across 4 tabs
  const OrderTable = ({ filterStatus }: { filterStatus: string }) => {
    const filteredOrders = MOCK_ORDERS.filter(order => order.status === filterStatus);

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
                  <Table.Cell><Text size="2" weight="bold">{order.total}</Text></Table.Cell>
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
                        <DropdownMenu.Item>View Details</DropdownMenu.Item>
                        <DropdownMenu.Item>Message Customer</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        {filterStatus === "paid" && <DropdownMenu.Item color="grass">Mark as Shipped</DropdownMenu.Item>}
                        {filterStatus === "cart" && <DropdownMenu.Item>Send Recovery Email</DropdownMenu.Item>}
                        <DropdownMenu.Item color="ruby">Cancel Order</DropdownMenu.Item>
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
          <Button size="3" color="indigo" style={{ cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            Add Product
          </Button>
        </Flex>
      </Flex>

      {/* 3. The Tabs Component managing the categories */}
      <Tabs.Root defaultValue="paid" className="bg-sky-900">
        <Tabs.List size="2">
          {/* Active Carts */}
          <Tabs.Trigger value="cart" style={{ cursor: "pointer", color: "var(--gray-2)" }}>
            In Cart
            <Badge size="1" color="orange" variant="solid" radius="full" className="ml-2">1</Badge>
          </Tabs.Trigger>
          
          {/* Pending Checkout */}
          <Tabs.Trigger value="checkout" style={{ cursor: "pointer", color: "var(--gray-2)" }}>
            Checkout Queue
            <Badge size="1" color="amber" variant="solid" radius="full" className="ml-2">1</Badge>
          </Tabs.Trigger>
          
          {/* Paid / Processing */}
          <Tabs.Trigger value="paid" style={{ cursor: "pointer", color: "var(--gray-2)" }}>
            Paid (Action Required)
            <Badge size="1" color="indigo" variant="solid" radius="full" className="ml-2">2</Badge>
          </Tabs.Trigger>
          
          {/* Shipped / Downloaded */}
          <Tabs.Trigger value="fulfilled" style={{ cursor: "pointer", color: "var(--gray-2)" }}>
            Shipped / Downloaded
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="2">
          <Tabs.Content value="cart">
            <OrderTable filterStatus="cart" />
          </Tabs.Content>
          
          <Tabs.Content value="checkout">
            <OrderTable filterStatus="checkout" />
          </Tabs.Content>
          
          <Tabs.Content value="paid">
            <OrderTable filterStatus="paid" />
          </Tabs.Content>
          
          <Tabs.Content value="fulfilled">
            <OrderTable filterStatus="fulfilled" />
          </Tabs.Content>
        </Box>
      </Tabs.Root>

    </Flex>
  );
}