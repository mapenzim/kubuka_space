"use client";

import {
  createUser,
  deleteManagedUser,
  setManagedUserStatus,
  updateManagedUser,
} from "@/app/actions/adminActions.server";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Grid,
  Heading,
  IconButton,
  Table,
  Text,
} from "@radix-ui/themes";
import {
  Archive,
  CirclePlus,
  MoreVertical,
  Pencil,
  RotateCcw,
  Search,
  ShieldBan,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type ManagedRole = "USER" | "EDITOR" | "ADMIN";
type UserStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

interface ManagedUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: ManagedRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  suspendedAt: string | null;
  archivedAt: string | null;
}

interface UserManagerProps {
  actorId: string;
  actorRole: "ADMIN" | "SUPERUSER";
  users: ManagedUser[];
}

const fieldClass =
  "mt-1.5 w-full rounded-md border border-(--gray-a7) bg-(--color-panel-solid) px-3 py-2.5 text-sm text-(--gray-12) outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function roleColor(role: ManagedRole): "indigo" | "cyan" | "gray" {
  if (role === "ADMIN") return "indigo";
  if (role === "EDITOR") return "cyan";
  return "gray";
}

function statusColor(
  status: UserStatus,
): "green" | "orange" | "gray" {
  if (status === "ACTIVE") return "green";
  if (status === "SUSPENDED") return "orange";
  return "gray";
}

export default function UserManager({
  actorId,
  actorRole,
  users,
}: UserManagerProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | UserStatus>("ALL");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, users]);

  const counts = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === "ACTIVE").length,
      suspended: users.filter((user) => user.status === "SUSPENDED").length,
      archived: users.filter((user) => user.status === "ARCHIVED").length,
    }),
    [users],
  );

  function finishAction(message: string) {
    toast.success(message);
    router.refresh();
  }

  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createUser(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      form.reset();
      setCreateOpen(false);
      finishAction("User created.");
    });
  }

  function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateManagedUser(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setEditingUser(null);
      finishAction("User updated.");
    });
  }

  async function changeStatus(user: ManagedUser, status: UserStatus) {
    const verbs: Record<UserStatus, string> = {
      ACTIVE: "restore",
      SUSPENDED: "suspend",
      ARCHIVED: "archive",
    };

    if (
      !window.confirm(
        `Are you sure you want to ${verbs[status]} ${user.name ?? user.email}?`,
      )
    ) {
      return;
    }

    setBusyUserId(user.id);
    const result = await setManagedUserStatus(user.id, status);
    setBusyUserId(null);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    finishAction(
      status === "ACTIVE"
        ? "User restored."
        : status === "SUSPENDED"
          ? "User suspended."
          : "User archived.",
    );
  }

  async function removeUser(user: ManagedUser) {
    if (
      !window.confirm(
        `Permanently delete ${user.name ?? user.email}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setBusyUserId(user.id);
    const result = await deleteManagedUser(user.id);
    setBusyUserId(null);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    finishAction("User permanently deleted.");
  }

  return (
    <Flex direction="column" gap="5">
      <Flex justify="between" align="center" wrap="wrap" gap="3">
        <Box>
          <Heading as="h1" size="6" mb="1">
            User Management
          </Heading>
          <Text color="gray" size="2">
            Create accounts and manage access without exposing the application superuser.
          </Text>
        </Box>

        <Button size="3" color="indigo" onClick={() => setCreateOpen(true)}>
          <CirclePlus size={17} aria-hidden="true" />
          Add user
        </Button>
      </Flex>

      <Grid columns={{ initial: "2", md: "4" }} gap="3">
        <SummaryCard label="Managed users" value={counts.total} />
        <SummaryCard label="Active" value={counts.active} tone="green" />
        <SummaryCard label="Suspended" value={counts.suspended} tone="orange" />
        <SummaryCard label="Archived" value={counts.archived} tone="gray" />
      </Grid>

      <Card size="2" variant="surface">
        <Flex gap="3" wrap="wrap" align="center">
          <label className="relative min-w-56 flex-1">
            <span className="sr-only">Search users</span>
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--gray-9)"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or role"
              className="w-full rounded-md border border-(--gray-a7) bg-(--color-panel-solid) py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </label>

          <label>
            <span className="sr-only">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "ALL" | UserStatus)
              }
              className="rounded-md border border-(--gray-a7) bg-(--color-panel-solid) px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
        </Flex>
      </Card>

      <Card size="2" variant="surface" className="overflow-hidden">
        <Box className="overflow-x-auto">
          <Table.Root variant="surface" size="3">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">
                  Actions
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {filteredUsers.map((user) => {
                const isSelf = user.id === actorId;
                const canManageAdmin =
                  actorRole === "SUPERUSER" || user.role !== "ADMIN" || isSelf;
                const canChangeLifecycle = canManageAdmin && !isSelf;
                const isBusy = busyUserId === user.id;

                return (
                  <Table.Row key={user.id} align="center">
                    <Table.RowHeaderCell>
                      <Flex align="center" gap="3">
                        <Avatar
                          size="3"
                          src={user.image ?? undefined}
                          fallback={(user.name ?? user.email).slice(0, 1).toUpperCase()}
                          color="indigo"
                          radius="full"
                        />
                        <Box>
                          <Flex align="center" gap="2">
                            <Text as="div" size="2" weight="bold">
                              {user.name || "Unnamed user"}
                            </Text>
                            {isSelf && (
                              <Badge color="gray" variant="soft" size="1">
                                You
                              </Badge>
                            )}
                          </Flex>
                          <Text as="div" size="1" color="gray">
                            {user.email}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.RowHeaderCell>

                    <Table.Cell>
                      <Badge color={roleColor(user.role)} variant="soft">
                        {user.role}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell>
                      <Badge color={statusColor(user.status)} variant="soft">
                        {user.status.toLowerCase()}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell>
                      <Text size="2" color="gray">
                        {formatDate(user.createdAt)}
                      </Text>
                    </Table.Cell>

                    <Table.Cell align="right">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <IconButton
                            variant="ghost"
                            color="gray"
                            size="2"
                            disabled={isBusy || !canManageAdmin}
                            aria-label={`Manage ${user.name ?? user.email}`}
                          >
                            <MoreVertical size={17} aria-hidden="true" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content size="2" align="end">
                          <DropdownMenu.Item onSelect={() => setEditingUser(user)}>
                            <Pencil size={15} aria-hidden="true" />
                            Edit user
                          </DropdownMenu.Item>

                          {user.status === "SUSPENDED" && (
                            <DropdownMenu.Item
                              disabled={!canChangeLifecycle}
                              onSelect={() => void changeStatus(user, "ACTIVE")}
                            >
                              <UserCheck size={15} aria-hidden="true" />
                              Activate
                            </DropdownMenu.Item>
                          )}

                          {user.status === "ARCHIVED" && (
                            <DropdownMenu.Item
                              disabled={!canChangeLifecycle}
                              onSelect={() => void changeStatus(user, "ACTIVE")}
                            >
                              <RotateCcw size={15} aria-hidden="true" />
                              Restore
                            </DropdownMenu.Item>
                          )}

                          {user.status === "ACTIVE" && (
                            <DropdownMenu.Item
                              color="orange"
                              disabled={!canChangeLifecycle}
                              onSelect={() => void changeStatus(user, "SUSPENDED")}
                            >
                              <ShieldBan size={15} aria-hidden="true" />
                              Suspend
                            </DropdownMenu.Item>
                          )}

                          {user.status !== "ARCHIVED" && (
                            <DropdownMenu.Item
                              disabled={!canChangeLifecycle}
                              onSelect={() => void changeStatus(user, "ARCHIVED")}
                            >
                              <Archive size={15} aria-hidden="true" />
                              Archive
                            </DropdownMenu.Item>
                          )}

                          <DropdownMenu.Separator />
                          <DropdownMenu.Item
                            color="red"
                            disabled={!canChangeLifecycle}
                            onSelect={() => void removeUser(user)}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                            Delete permanently
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>

          {filteredUsers.length === 0 && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              gap="2"
              className="min-h-52 border-t border-(--gray-a6) px-4 text-center"
            >
              <Users size={28} className="text-(--gray-8)" aria-hidden="true" />
              <Text weight="medium">No users found</Text>
              <Text size="2" color="gray">
                Adjust the search or status filter.
              </Text>
            </Flex>
          )}
        </Box>
      </Card>

      <UserDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        actorRole={actorRole}
        pending={isPending}
        onSubmit={submitCreate}
      />

      <UserDialog
        mode="edit"
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
        actorRole={actorRole}
        actorId={actorId}
        user={editingUser}
        pending={isPending}
        onSubmit={submitEdit}
      />
    </Flex>
  );
}

function SummaryCard({
  label,
  value,
  tone = "indigo",
}: {
  label: string;
  value: number;
  tone?: "indigo" | "green" | "orange" | "gray";
}) {
  const toneClasses = {
    indigo: "text-indigo-500",
    green: "text-green-500",
    orange: "text-orange-500",
    gray: "text-(--gray-9)",
  };

  return (
    <Card size="2" variant="surface">
      <Text as="div" size="1" color="gray" weight="medium">
        {label}
      </Text>
      <Heading as="h3" size="6" mt="1" className={toneClasses[tone]}>
        {value.toLocaleString()}
      </Heading>
    </Card>
  );
}

function UserDialog({
  mode,
  open,
  onOpenChange,
  actorRole,
  actorId,
  user,
  pending,
  onSubmit,
}: {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actorRole: "ADMIN" | "SUPERUSER";
  actorId?: string;
  user?: ManagedUser | null;
  pending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const editingSelf = mode === "edit" && user?.id === actorId;
  const adminRoleLocked =
    mode === "edit" &&
    actorRole !== "SUPERUSER" &&
    user?.role === "ADMIN";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-(--gray-a7) bg-(--color-panel-solid) p-6 text-(--gray-12) shadow-2xl outline-none">
          <Flex justify="between" align="start" gap="4" mb="5">
            <Box>
              <Dialog.Title className="text-xl font-semibold">
                {mode === "create" ? "Add user" : "Edit user"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-(--gray-10)">
                {mode === "create"
                  ? "Create an account and assign its initial access role."
                  : "Update account details. Email addresses are permanent."}
              </Dialog.Description>
            </Box>
            <Dialog.Close asChild>
              <IconButton variant="ghost" color="gray" aria-label="Close">
                <X size={18} aria-hidden="true" />
              </IconButton>
            </Dialog.Close>
          </Flex>

          <form onSubmit={onSubmit} className="space-y-4">
            {user && <input type="hidden" name="userId" value={user.id} />}

            <label className="block text-sm font-medium">
              Full name
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                defaultValue={user?.name ?? ""}
                className={fieldClass}
              />
            </label>

            <label className="block text-sm font-medium">
              Email address
              <input
                name="email"
                type="email"
                required
                readOnly={mode === "edit"}
                autoComplete="email"
                defaultValue={user?.email ?? ""}
                className={fieldClass}
              />
              {mode === "edit" && (
                <span className="mt-1.5 block text-xs text-(--gray-10)">
                  Email cannot be changed after account creation.
                </span>
              )}
            </label>

            <label className="block text-sm font-medium">
              Role
              <select
                name="role"
                required
                defaultValue={user?.role ?? "USER"}
                disabled={editingSelf || adminRoleLocked}
                className={fieldClass}
              >
                <option value="USER">User</option>
                <option value="EDITOR">Editor</option>
                {(actorRole === "SUPERUSER" || user?.role === "ADMIN") && (
                  <option value="ADMIN">Administrator</option>
                )}
              </select>
              {(editingSelf || adminRoleLocked) && user && (
                <>
                  <input type="hidden" name="role" value={user.role} />
                  <span className="mt-1.5 block text-xs text-(--gray-10)">
                    {editingSelf
                      ? "You cannot change your own role."
                      : "Only the superuser can change administrator roles."}
                  </span>
                </>
              )}
            </label>

            <label className="block text-sm font-medium">
              {mode === "create" ? "Temporary password" : "New password"}
              <input
                name="password"
                type="password"
                required={mode === "create"}
                minLength={8}
                autoComplete="new-password"
                placeholder={
                  mode === "create"
                    ? "At least 8 characters"
                    : "Leave blank to keep the current password"
                }
                className={fieldClass}
              />
            </label>

            <Flex justify="end" gap="3" mt="6">
              <Dialog.Close asChild>
                <Button type="button" variant="soft" color="gray" disabled={pending}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" color="indigo" disabled={pending}>
                {pending
                  ? "Saving…"
                  : mode === "create"
                    ? "Create user"
                    : "Save changes"}
              </Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
