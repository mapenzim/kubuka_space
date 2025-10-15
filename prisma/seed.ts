import { PrismaClient, Prisma } from '@prisma/client'
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Kubuka Space',
    email: 'kubukahub@gmail.com',
    password: await hash("hubtwabuka", 10),
    role: "SUPERUSER",
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
    role: "ADMIN",
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
  for (const u of userData) {
    await prisma.user.create({ data: u })
  }
}

main();