import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- 1️⃣ Create roles and permissions ---
  const rolesData = [
    {
      name: "ADMIN",
      permissions: [
        { path: "/dashboard" },
        { path: "/api/admin" },
      ],
    },
    {
      name: "EDITOR",
      permissions: [
        { path: "/dashboard/posts" },
        { path: "/dashboard/comments" },
      ],
    },
    {
      name: "SUPERUSER",
      permissions: [
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
        name: role.name,
        permissions: { create: role.permissions },
      },
    });
  }

  console.log("✅ Roles & permissions seeded.");

  // --- 2️⃣ Get roles for assignment ---
  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  const editorRole = await prisma.role.findUnique({ where: { name: "EDITOR" } });
  const superRole = await prisma.role.findUnique({ where: { name: "SUPERUSER" } });

  if (!adminRole || !editorRole || !superRole) {
    throw new Error("❌ Missing one or more roles.");
  }

  // --- 3️⃣ Define users with role connections ---
  const userData: Prisma.UserCreateInput[] = [
    {
      name: "Kubuka Space",
      email: "kubukahub@gmail.com",
      password: await hash("hubtwabuka", 10),
      role: { connect: { id: editorRole.id } },
      posts: {
        create: [
          {
            title: "Welcome to Kubuka Hub",
            content:
              "This hub is for the people who want to create content for the Binga Community. Feel free to connect to our channels for more.",
            published: true,
          },
        ],
      },
    },
    {
      name: "Mapenzi Mudimba",
      email: "hazelman@live.com",
      password: await hash("mapenzim", 10),
      role: { connect: { id: adminRole.id } },
      posts: {
        create: [
          {
            title: "Follow Kubuka for more information",
            content:
              "Kubuka is a community initiative to make sure the content we serve is visible throughout the universe. Follow us for more.",
            published: true,
          },
        ],
      },
    },
    {
      name: "Super Admin",
      email: "superadmin@example.com",
      password: await hash("super123", 10),
      role: { connect: { id: superRole.id } },
    },
  ];

  // --- 4️⃣ Upsert users safely ---
  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  console.log("✅ Users & their roles seeded.");
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
