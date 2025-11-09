// lib/prisma.ts
import { PrismaClient as PrismaNodeClient } from "@prisma/client";
import { PrismaClient as PrismaEdgeClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaNodeClient | undefined;
};

// Determine whether to use Accelerate (for production)
const isProduction = process.env.NODE_ENV === "production";
const hasAccelerate = Boolean(process.env.PRISMA_DATABASE_URL);

// Local dev Prisma (Node.js)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaNodeClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });
}

// Use the proper Prisma instance
const prisma = isProduction && hasAccelerate
  ? new PrismaEdgeClient({
      datasourceUrl: process.env.PRISMA_DATABASE_URL,
    }).$extends(withAccelerate())
  : globalForPrisma.prisma;

// Prevent new instances in dev (hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma as PrismaNodeClient;
}

export default prisma as PrismaNodeClient;
