import "dotenv/config";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { ulid } from "ulid";
import prisma from "@/lib/prisma";

// 🔐 Helper for password hashing
async function securePassword(password: string) {
  return await hash(password, 10);
}

async function main() {

  // --- 1️⃣ Roles & Permissions ---
  const rolesData = [
    {
      name: "ADMIN",
      permissions: [
        { path: "/*" },
      ],
    },
    {
      name: "EDITOR",
      permissions: [
        { path: "/" },
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
      password: await securePassword("kubuka1234"),
      role: { connect: { id: editorRole.id } },
      posts: {},
    },
    {
      id: ulid(),
      name: "Mapenzi Mudimba",
      email: "hazelman@live.com",
      password: await securePassword("mapenzim"),
      role: { connect: { id: adminRole.id } },
      posts: {},
    },
    {
      id: ulid(),
      name: "Super Admin",
      email: "superadmin@kubuka.space",
      password: await securePassword("superadmin1234"),
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


  // --- 4️⃣ Merchandise ---
  const productCategories = [
    { name: "Electrical", slug: "electrical" },
    { name: "Fruits & Vegetables", slug: "fruits-vegetables" },
    { name: "Timber", slug: "timber" },
    { name: "Digital Services", slug: "digital-services" },
  ];
  for (const category of productCategories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, isActive: true },
      create: { id: ulid(), ...category },
    });
  }

  const digitalServices = await prisma.productCategory.findUnique({ where: { slug: "digital-services" } });

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
        stockQuantity: 100,
        deletedAt: null,
        categoryId: digitalServices?.id,
      },
      create: { ...mc, stockQuantity: 100, categoryId: digitalServices?.id },
    });
  }


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


  // --- Log entry ---
  await prisma.log.create({
    data: {
      id: ulid(),
      action: "SEED_INIT",
      details: { message: "Initial seed completed" },
    },
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error during seed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
