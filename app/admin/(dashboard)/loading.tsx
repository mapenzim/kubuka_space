import { Flex, Grid, Card, Box, Skeleton, Heading, Text, Table } from "@radix-ui/themes";

export default function AdminLoadingState() {
  return (
    <Flex direction="column" gap="6">
      
      {/* Header Skeleton */}
      <Flex justify="between" align="center">
        <Box>
          <Skeleton>
            <Heading as="h1" size="6" mb="1">Loading Page</Heading>
          </Skeleton>
          <Skeleton>
            <Text size="2">Fetching your data from the database...</Text>
          </Skeleton>
        </Box>
        <Skeleton>
          <Box className="h-8 w-32 rounded-md" />
        </Skeleton>
      </Flex>

      {/* Stat Cards Skeleton Grid */}
      <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} size="3" variant="surface">
            <Flex direction="column" gap="3">
              <Skeleton><Text size="2">Total Users</Text></Skeleton>
              <Skeleton><Heading as="h3" size="8">0,000</Heading></Skeleton>
              <Skeleton><Text size="2">+0% from last month</Text></Skeleton>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Table Skeleton */}
      <Card size="2" variant="surface" className="overflow-hidden mt-2">
        <Table.Root variant="surface" size="3">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell><Skeleton>Column 1</Skeleton></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><Skeleton>Column 2</Skeleton></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><Skeleton>Column 3</Skeleton></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right"><Skeleton>Actions</Skeleton></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[1, 2, 3, 4, 5].map((row) => (
              <Table.Row key={row}>
                <Table.RowHeaderCell>
                  <Flex gap="3" align="center">
                    <Skeleton><Box className="w-8 h-8 rounded-full" /></Skeleton>
                    <Box>
                      <Skeleton><Text size="2">User Name Goes Here</Text></Skeleton>
                      <Box mt="1">
                        <Skeleton><Text size="1">user@example.com</Text></Skeleton>
                      </Box>
                    </Box>
                  </Flex>
                </Table.RowHeaderCell>
                <Table.Cell><Skeleton><Box className="w-16 h-5 rounded-full" /></Skeleton></Table.Cell>
                <Table.Cell><Skeleton><Text size="2">Oct 24, 2025</Text></Skeleton></Table.Cell>
                <Table.Cell align="right"><Skeleton><Box className="w-6 h-6 inline-block" /></Skeleton></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
      
    </Flex>
  );
}