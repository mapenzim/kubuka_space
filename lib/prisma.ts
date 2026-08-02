import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL_KUBUKA!),
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

export function serializeDecimal(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "object" && value?.toNumber
        ? value.toNumber()
        : value
    )
  );
}
