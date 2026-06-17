import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL_KUBUKA!);

const prisma = new PrismaClient({
  adapter,
});

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