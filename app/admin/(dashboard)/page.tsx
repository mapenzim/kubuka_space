import Link from "next/link";
import { Grid, Card, Flex, Text, Heading, Box, Badge } from "@radix-ui/themes";
import { getAdminDashboardData } from "@/app/actions/adminActions.server";
import { formatTime } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();

  const StatCard = ({ title, value, detail }: { title: string; value: string; detail: string }) => (
    <Card size="3" variant="surface">
      <Flex direction="column" gap="2">
        <Text size="2" color="gray" weight="medium">{title}</Text>
        <Heading as="h3" size="8">{value}</Heading>
        <Text size="2" color="gray">{detail}</Text>
      </Flex>
    </Card>
  );

  return (
    <Flex direction="column" gap="6">
      
      {/* Scrollable inside Grid */}
      <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4">
        <StatCard title="Total Users" value={dashboard.stats.totalUsers.toLocaleString()} detail="Registered accounts" />
        <StatCard title="Published Posts" value={dashboard.stats.publishedPosts.toLocaleString()} detail="Live posts" />
        <StatCard title="Active Orders" value={dashboard.stats.activeOrders.toLocaleString()} detail="Non-cancelled orders" />
        <StatCard title="Paid Revenue" value={`$${dashboard.stats.paidRevenue.toFixed(2)}`} detail="Confirmed payments" />
      </Grid>

      {/* Adding more content to show the scrollability */}
      <Grid columns={{ initial: "1", lg: "3" }} gap="4">
        {/* Large item spanning 2 columns */}
        <Box className="lg:col-span-2">
          <Card size="4" variant="surface" className="min-h-72 lg:h-100">
            <Heading as="h4" size="4" mb="4">Recent Activity</Heading>
            {dashboard.recentActivity.length === 0 ? (
              <Flex align="center" justify="center" className="h-full rounded-lg border-2 border-dashed border-(--gray-a6)">
                <Text color="gray">No recent activity.</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="2" className="overflow-y-auto">
                {dashboard.recentActivity.map((activity) => (
                  <Link key={activity.id} href={activity.href} className="rounded-lg border border-(--gray-a6) p-3 transition-colors hover:bg-(--gray-a3)">
                    <Flex justify="between" align="start" gap="3">
                      <Box className="min-w-0">
                        <Text as="div" size="2" weight="medium" className="truncate">{activity.label}</Text>
                        <Text as="div" size="1" color="gray">{activity.detail}</Text>
                      </Box>
                      <Text size="1" color="gray" className="shrink-0">{formatTime(activity.date)}</Text>
                    </Flex>
                  </Link>
                ))}
              </Flex>
            )}
          </Card>
        </Box>

        {/* Smaller side item */}
        <Box className="lg:col-span-1">
          <Card size="4" variant="surface" className="min-h-72 lg:h-100">
            <Heading as="h4" size="4" mb="4">Pending Approvals</Heading>
            {dashboard.pendingApprovals.length === 0 ? (
              <Flex align="center" justify="center" className="h-full rounded-lg border-2 border-dashed border-(--gray-a6)">
                <Text color="gray">Nothing is waiting for approval.</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="2" className="overflow-y-auto">
                {dashboard.pendingApprovals.map((item) => (
                  <Link key={item.id} href={item.href} className="rounded-lg border border-(--gray-a6) p-3 transition-colors hover:bg-(--gray-a3)">
                    <Flex justify="between" align="center" gap="3">
                      <Text size="2" weight="medium" className="truncate">{item.label}</Text>
                      <Badge color="orange" variant="soft" className="shrink-0">{item.detail}</Badge>
                    </Flex>
                  </Link>
                ))}
              </Flex>
            )}
          </Card>
        </Box>
      </Grid>
      
    </Flex>
  );
}
