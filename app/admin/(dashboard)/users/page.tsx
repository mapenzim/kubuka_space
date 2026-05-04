import { getAllUsers } from "@/app/actions/adminActions.server";
import { auth } from "@/auth";
import { formatDate } from "@/lib/utils";
import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Table, 
  Badge, 
  Avatar, 
  Box, 
  Card,
  DropdownMenu,
  IconButton
} from "@radix-ui/themes";

export default async function AdminUsersPage() {
  const users = await getAllUsers();
  const session = await auth();

  return (
    <Flex direction="column" gap="5">
      
      {/* Page Header */}
      <Flex justify="between" align="center" wrap="wrap" gap="3">
        <Box>
          <Heading as="h1" size="6" mb="1">User Management</Heading>
          <Text color="gray" size="2">Manage your platform's users, roles, and permissions.</Text>
        </Box>
        <Button size="3" color="indigo" style={{ cursor: "pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
          </svg>
          Add New User
        </Button>
      </Flex>

      {/* Main Data Table */}
      <Card size="2" variant="surface" className="overflow-hidden">
        {/* We use Box with overflow-x-auto to make the table scrollable on mobile */}
        <Box className="overflow-x-auto">
          <Table.Root variant="surface" size="3">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.length && users.map((user) => (
                <Table.Row key={user.id} align="center">
                  
                  {/* User Profile Column */}
                  <Table.RowHeaderCell>
                    <Flex align="center" gap="3">
                      <Avatar 
                        size="3" 
                        src="" 
                        fallback={user.name?.slice(0,1) as string} 
                        color="gold"
                        radius="full"
                      />
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          {user.name}
                        </Text>
                        <Text as="div" size="1" color="gray">
                          {user.email}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.RowHeaderCell>

                  {/* Role Column */}
                  <Table.Cell>
                    <Badge color={user?.role?.name === "ADMIN" ? "indigo" : user.role?.name === "USER" ? "cyan" : "gray"} variant="soft">
                      {user?.role?.name}
                    </Badge>
                  </Table.Cell>

                  {/* Status Column */}
                  <Table.Cell>
                    <Badge 
                      color="grass" 
                      variant="solid"
                      radius="full"
                    >
                      {/* Small status dot indicator */}
                      <Box className={`w-1.5 h-1.5 rounded-full mr-1 bg-amber-50`} display="inline-block" />
                      Active
                    </Badge>
                  </Table.Cell>

                  {/* Date Joined Column */}
                  <Table.Cell>
                    <Text size="2" color="gray">{formatDate(user.createdAt)}</Text>
                  </Table.Cell>

                  {/* Actions Column (Radix Dropdown Menu) */}
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
                        <DropdownMenu.Item>Edit Profile</DropdownMenu.Item>
                        <DropdownMenu.Item>Change Role</DropdownMenu.Item>
                        <DropdownMenu.Item color="ruby">Suspend User</DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>

                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card>
      
    </Flex>
  );
}