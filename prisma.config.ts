import "dotenv/config";
import path from "node:path";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  datasource: {
    // Migrate still needs a plain URL
    url: process.env.PRISMA_DATABASE_URL!,
  },

  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },

  views: {
    path: path.join("prisma", "views"),
  },

  typedSql: {
    path: path.join("prisma", "queries"),
  },
});