import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { ulidId as ulid } from "@/lib/server-utils";


// 🔐 Helper for password hashing
async function securePassword(password: string) {
  return await hash(password, 10);
}

async function main() {
  console.log("🌱 Seeding database...");

  // --- 1️⃣ Roles & Permissions ---
  const rolesData = [
    {
      name: "ADMIN",
      permissions: [
        { path: "/" },
        { path: "/dashboard" },
        { path: "/profile" },
      ],
    },
    {
      name: "EDITOR",
      permissions: [
        { path: "/" },
        { path: "/dashboard/posts" },
        { path: "/dashboard/comments" },
      ],
    },
    {
      name: "SUPERUSER",
      permissions: [
        { path: "/" },
        { path: "/dashboard" },
        { path: "/api/admin" },
        { path: "/api/secure" },
      ],
    },
  ];

  await prisma.$transaction(async (tx) => {
    for (const role of rolesData) {
      await tx.role.upsert({
        where: { name: role.name },
        update: {},
        create: {
          id: ulid(),
          name: role.name,
          permissions: { create: role.permissions.map((p) => ({ ...p, id: ulid() })) },
        },
      });
    }
  });

  console.log("✅ Roles & permissions seeded.");

  // --- 2️⃣ Fetch roles ---
  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  const editorRole = await prisma.role.findUnique({ where: { name: "EDITOR" } });
  const superRole = await prisma.role.findUnique({ where: { name: "SUPERUSER" } });

  if (!adminRole || !editorRole || !superRole) {
    throw new Error("❌ Missing one or more roles.");
  }

  // --- 3️⃣ Users ---
  const userData: Prisma.UserCreateInput[] = [
    {
      id: ulid(),
      name: "Kubuka Space",
      email: "kubukahub@gmail.com",
      password: await securePassword("hubtwabuka"),
      role: { connect: { id: editorRole.id } },
      posts: {
        create: [
          {
            id: ulid(),
            title: "Welcome to Kubuka Hub",
            content:
              "This hub is for the people who want to create content for the Binga Community. Feel free to connect to our channels for more.",
            published: true,
          },
        ],
      },
    },
    {
      id: ulid(),
      name: "Mapenzi Mudimba",
      email: "hazelman@live.com",
      password: await securePassword("mapenzim"),
      role: { connect: { id: adminRole.id } },
      posts: {
        create: [
          {
            id: ulid(),
            title: "Follow Kubuka for more information",
            content:
              "Kubuka is a community initiative to make sure the content we serve is visible throughout the universe. Follow us for more.",
            published: true,
          },
        ],
      },
    },
    {
      id: ulid(),
      name: "Super Admin",
      email: "superadmin@kubuka.space",
      password: await securePassword("superkubuka"),
      role: { connect: { id: superRole.id } },
    },
  ];

  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  console.log("✅ Users seeded.");

  // --- 4️⃣ Merchandise ---
  const offers = [
    "installation",
    "tutorial",
    "one year support",
    "source code",
    "call-in help",
    "code samples",
    "dependency upgrades",
    "personalized authentication strategy",
  ];

  const merchandise = [
    {
      id: ulid(),
      title: "starter",
      price: 160,
      body: offers.slice(0, 3).join(", "),
    },
    {
      id: ulid(),
      title: "personal",
      price: 220,
      body: offers.slice(0, 7).join(", "),
    },
    {
      id: ulid(),
      title: "business",
      price: 480,
      body: offers.join(", "),
    },
  ];

  for (const mc of merchandise) {
    await prisma.merchandise.upsert({
      where: { title: mc.title },
      update: {
        price: mc.price,
        body: mc.body,
      },
      create: mc,
    });
  }

  console.log("✅ Merchandise seeded.");

  // --- 5️⃣ Settings ---
  const users = await prisma.user.findMany();
  for (const user of users) {
    await prisma.settings.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        id: ulid(),
        userId: user.id,
        theme: "light",
        language: "en",
        notifyByEmail: true,
      },
    });
  }

  console.log("✅ Settings seeded.");

  // --- 6️⃣ Wishlist ---
  const starter = await prisma.merchandise.findUnique({ where: { title: "starter" } });
  if (starter) {
    await prisma.wishlist.create({
      data: {
        id: ulid(),
        user: { connect: { email: "kubukahub@gmail.com" } },
        merchandise: { connect: { id: starter.id } },
      },
    });
  }

  console.log("✅ Wishlist seeded.");

  // --- 7️⃣ Order + Payment + ShippingAddress ---
  const order = await prisma.order.create({
    data: {
      id: ulid(),
      user: { connect: { email: "hazelman@live.com" } },
      totalAmount: 160,
      status: "paid",
      items: {
        create: [
          {
            id: ulid(),
            merchandiseId: starter?.id || "",
            title: "starter",
            price: 160,
            quantity: 1,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      id: ulid(),
      orderId: order.id,
      amount: 160,
      method: "paynow",
      status: "PAID",
      transactionRef: "TX123456",
    },
  });

  await prisma.shippingAddress.create({
    data: {
      id: ulid(),
      order: { connect: { id: order.id } },
      fullName: "Mapenzi Mudimba",
      street: "123 Kubuka Street",
      city: "Binga",
      country: "Zimbabwe",
      phone: "+263771234567",
    },
  });

  console.log("✅ Orders, payments, and shipping addresses seeded.");

  // --- 8️⃣ Log entry ---
  await prisma.log.create({
    data: {
      id: ulid(),
      action: "SEED_INIT",
      details: { message: "Initial seed completed" },
    },
  });

  console.log("✅ Log entry created.");
}

main()
  .then(async () => {
    console.log("🌿 Seeding complete!");
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error during seed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });