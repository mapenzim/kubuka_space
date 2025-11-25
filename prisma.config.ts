import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("prisma", "schema.prisma"),

  datasource: {
    url: process.env.DATABASE_URL!,
  },

  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.mts",
  },

  views: {
    path: path.join("prisma", "views"),
  },

  typedSql: {
    path: path.join("prisma", "queries"),
  },
} satisfies PrismaConfig;
