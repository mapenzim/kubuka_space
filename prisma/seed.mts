import { PrismaClient, Prisma } from '@prisma/client'
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Kubuka Space',
    email: 'kubukahub@gmail.com',
    password: await hash("hubtwabuka", 10),
    posts: {
      create: [
        {
          title: 'Welcome to Kubuka HUb',
          content: 'This hub is for the people who want to create content for the Binga Community. Feel free to connect to our channels for more',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Mapenzi Mudimba',
    email: 'hazelman@live.com',    
    password: await hash("mapenzim", 10),
    posts: {
      create: [
        {
          title: 'Follow Kubuka for more information',
          content: 'Kubuka is a community initiative to make sure the content we serve is visible throughout the universe. Follow us for more.',
          published: true,
        },
      ],
    },
  }
]

export async function main() {
  /*for (const u of userData) {
    await prisma.user.create({ data: u })
  }*/
  
  // Define your default roles and their access paths
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

  // Upsert roles and permissions
  for (const role of rolesData) {
    const existing = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        permissions: { create: role.permissions },
      },
    });

    console.log(`✅ Created/updated role: ${existing.name}`);
  }

  await prisma.user.upsert({
    where: { email: "hazelman@live.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Super Admin",
      role: { connect: { name: "ADMIN" } },  
      password: await hash("mapenzim", 10),
      posts: {
        create: [
          {
            title: 'Follow Kubuka for more information',
            content: 'Kubuka is a community initiative to make sure the content we serve is visible throughout the universe. Follow us for more.',
            published: true,
          },
        ],
      },
    },
  });
}

main()
  .catch((err) => {
    console.error("❌ Error seeding database:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
