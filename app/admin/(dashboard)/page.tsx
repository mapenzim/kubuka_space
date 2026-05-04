import { Grid, Card, Flex, Text, Heading, Box } from "@radix-ui/themes";

export default function AdminDashboardPage() {
  // Reusable Statistic Card
  const StatCard = ({ title, value, trend }: { title: string; value: string; trend: string }) => (
    <Card size="3" variant="surface">
      <Flex direction="column" gap="2">
        <Text size="2" color="gray" weight="medium">{title}</Text>
        <Heading as="h3" size="8">{value}</Heading>
        <Text size="2" color={trend.startsWith("+") ? "green" : "red"}>
          {trend} from last month
        </Text>
      </Flex>
    </Card>
  );

  return (
    <Flex direction="column" gap="6">
      
      {/* Scrollable inside Grid */}
      <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4">
        <StatCard title="Total Users" value="1,248" trend="+12%" />
        <StatCard title="Published Posts" value="84" trend="+4%" />
        <StatCard title="Store Orders" value="342" trend="+18%" />
        <StatCard title="Revenue" value="$4,231" trend="-2%" />
      </Grid>

      {/* Adding more content to show the scrollability */}
      <Grid columns={{ initial: "1", lg: "3" }} gap="4">
        {/* Large item spanning 2 columns */}
        <Box className="lg:col-span-2">
          <Card size="4" variant="surface" className="h-100">
            <Heading as="h4" size="4" mb="4">Recent Activity</Heading>
            <Flex align="center" justify="center" className="h-full border-2 border-dashed border-(--gray-a6) rounded-lg">
              <Text color="gray">Chart Component Goes Here</Text>
            </Flex>
          </Card>
        </Box>

        {/* Smaller side item */}
        <Box className="lg:col-span-1">
          <Card size="4" variant="surface" className="h-100">
            <Heading as="h4" size="4" mb="4">Pending Approvals</Heading>
            <Flex align="center" justify="center" className="h-full border-2 border-dashed border-(--gray-a6) rounded-lg">
              <Text color="gray">List Goes Here</Text>
            </Flex>
          </Card>
        </Box>
      </Grid>
      
      {/* Adding more content to show the scrollability */}
      <Grid columns={{ initial: "1", lg: "3" }} gap="4">
        {/* Large item spanning 2 columns */}
        <Box className="lg:col-span-2">
          <Card size="4" variant="surface" className="h-100">
            <Heading as="h4" size="4" mb="4">Recent Activity</Heading>
            <Flex align="center" justify="center" className="h-full border-2 border-dashed border-(--gray-a6) rounded-lg">
              <Text color="gray">Chart Component Goes Here</Text>
            </Flex>
          </Card>
        </Box>

        {/* Smaller side item */}
        <Box className="lg:col-span-1">
          <Card size="4" variant="surface" className="h-100">
            <Heading as="h4" size="4" mb="4">Pending Approvals</Heading>
            <Flex align="center" justify="center" className="h-full border-2 border-dashed border-(--gray-a6) rounded-lg">
              <Text color="gray">List Goes Here</Text>
            </Flex>
          </Card>
        </Box>
      </Grid>
    </Flex>
  );
}