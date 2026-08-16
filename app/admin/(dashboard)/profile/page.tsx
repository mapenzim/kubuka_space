import { auth } from "@/auth";
import { isAdminRole } from "@/lib/roles";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
} from "@radix-ui/themes";
import {
  CalendarDays,
  FileText,
  Mail,
  ShieldCheck,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/authentication?callbackUrl=/admin/profile");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/");
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          name: true,
        },
      },
      bio: {
        select: {
          text: true,
        },
      },
      _count: {
        select: {
          posts: true,
          orders: true,
        },
      },
    },
  });

  if (!admin || !isAdminRole(admin.role?.name)) {
    redirect("/");
  }

  const displayName = admin.name?.trim() || "Administrator";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Flex direction="column" gap="6">
      <Box>
        <Heading as="h1" size="7" mb="1">
          Administrator Profile
        </Heading>
        <Text color="gray" size="2">
          View your administrator identity and account activity.
        </Text>
      </Box>

      <Grid columns={{ initial: "1", lg: "12" }} gap="5" align="start">
        <Box className="lg:col-span-4">
          <Flex direction="column" gap="5">
            <Card size="4" variant="surface">
              <Flex direction="column" align="center" gap="4" className="py-3 text-center">
                <Avatar
                  size="8"
                  src={admin.image ?? undefined}
                  fallback={initials || "A"}
                  color="indigo"
                  radius="full"
                  className="ring-4 ring-indigo-500/10"
                />

                <Box>
                  <Heading as="h2" size="6">
                    {displayName}
                  </Heading>
                  <Text as="p" size="2" color="gray" mt="1">
                    {admin.email}
                  </Text>
                </Box>

                <Badge color="indigo" variant="soft" size="2">
                  <ShieldCheck size={15} aria-hidden="true" />
                  {admin.role?.name ?? "ADMIN"}
                </Badge>
              </Flex>
            </Card>

            <Card size="3" variant="surface">
              <Flex align="center" gap="2" mb="3">
                <ShieldCheck size={19} className="text-indigo-500" aria-hidden="true" />
                <Heading as="h2" size="4">
                  Admin access
                </Heading>
              </Flex>
              <Text as="p" size="2" color="gray" className="leading-6">
                This profile belongs to an authorised administrator account and
                is available only inside the protected admin area.
              </Text>
            </Card>
          </Flex>
        </Box>

        <Box className="lg:col-span-8">
          <Flex direction="column" gap="5">
            <Card size="4" variant="surface">
              <Flex align="center" gap="2" mb="5">
                <UserRound size={20} className="text-indigo-500" aria-hidden="true" />
                <Heading as="h2" size="5">
                  Account details
                </Heading>
              </Flex>

              <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                <AccountDetail
                  icon={<Mail size={18} aria-hidden="true" />}
                  label="Email address"
                  value={admin.email}
                />
                <AccountDetail
                  icon={<ShieldCheck size={18} aria-hidden="true" />}
                  label="Access role"
                  value={admin.role?.name ?? "Administrator"}
                />
                <AccountDetail
                  icon={<CalendarDays size={18} aria-hidden="true" />}
                  label="Member since"
                  value={formatDate(admin.createdAt)}
                />
                <AccountDetail
                  icon={<CalendarDays size={18} aria-hidden="true" />}
                  label="Profile updated"
                  value={formatDate(admin.updatedAt)}
                />
              </Grid>

              <Box mt="5" pt="5" className="border-t border-(--gray-a6)">
                <Text as="div" size="1" weight="bold" color="gray" mb="2" className="uppercase tracking-wider">
                  About
                </Text>
                <Text as="p" size="2" className="whitespace-pre-wrap leading-6">
                  {admin.bio?.text || "No administrator bio has been added yet."}
                </Text>
              </Box>
            </Card>

            <Grid columns={{ initial: "1", sm: "2" }} gap="4">
              <ProfileStat
                icon={<FileText size={20} aria-hidden="true" />}
                label="Posts"
                value={admin._count.posts}
                detail="Authored content"
              />
              <ProfileStat
                icon={<ShoppingCart size={20} aria-hidden="true" />}
                label="Orders"
                value={admin._count.orders}
                detail="Orders on this account"
              />
            </Grid>

            <Card size="3" variant="surface">
              <Flex justify="between" align="center" wrap="wrap" gap="3">
                <Box>
                  <Text as="div" size="1" weight="bold" color="gray" className="uppercase tracking-wider">
                    Account identifier
                  </Text>
                  <Text as="div" size="2" mt="1" className="font-mono">
                    {admin.id}
                  </Text>
                </Box>
                <Badge color="green" variant="soft">
                  Active
                </Badge>
              </Flex>
            </Card>
          </Flex>
        </Box>
      </Grid>
    </Flex>
  );
}

function AccountDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Flex gap="3" align="start" className="rounded-lg border border-(--gray-a6) bg-(--gray-a2) p-4">
      <Box className="mt-0.5 text-indigo-500">{icon}</Box>
      <Box className="min-w-0">
        <Text as="div" size="1" color="gray" weight="medium">
          {label}
        </Text>
        <Text as="div" size="2" weight="medium" mt="1" className="break-words">
          {value}
        </Text>
      </Box>
    </Flex>
  );
}

function ProfileStat({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <Card size="3" variant="surface">
      <Flex justify="between" align="start" gap="3">
        <Box>
          <Text as="div" size="2" color="gray" weight="medium">
            {label}
          </Text>
          <Heading as="h3" size="7" mt="2">
            {value.toLocaleString()}
          </Heading>
          <Text as="div" size="1" color="gray" mt="1">
            {detail}
          </Text>
        </Box>
        <Box className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-500">
          {icon}
        </Box>
      </Flex>
    </Card>
  );
}
