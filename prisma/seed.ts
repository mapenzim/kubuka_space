import "dotenv/config";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { ulid } from "ulid";
import prisma from "@/lib/prisma";

/*const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.ACCELERATE_URL_PRISMA_DATABASE_URL,
  max: 10, // 🔥 increase connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, })
});*/

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

  for (const role of rolesData) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        id: ulid(),
        name: role.name,
        permissions: {
          create: role.permissions.map((p) => ({
            ...p,
            id: ulid(),
          })),
        },
      },
    });
  }

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

  // --- 6️⃣ implemented later ---

  // --- 7️⃣ implemented later ---

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