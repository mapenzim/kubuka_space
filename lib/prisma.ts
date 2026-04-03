import { PrismaClient as PrismaNodeClient } from "@prisma/client";
import { PrismaClient as PrismaEdgeClient } from "@prisma/client/edge";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import pkg, { Pool } from "pg";

const { Pool: PgPool } = pkg;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaNodeClient;
  pool?: Pool;
};

const isProduction = process.env.NODE_ENV === "production";
const connectionString =
  process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL;

let prisma: PrismaNodeClient;

// 🏭 Production = Edge client with Accelerate
if (isProduction) {
  prisma = new PrismaEdgeClient().$extends(withAccelerate()) as unknown as PrismaNodeClient;
} else {
  // 🧩 Dev = pg.Pool + PrismaPg adapter
  if (!globalForPrisma.pool) {
    const pool = new PgPool({ connectionString });
    globalForPrisma.pool = pool;

    pool.connect()
      .then(client => {
        console.log("✅ PostgreSQL connected successfully.");
        client.release();
      })
      .catch(err => {
        console.error("❌ PostgreSQL connection failed:", err.message);
      });

    const cleanup = async () => {
      console.log("🧹 Closing PostgreSQL pool...");
      await pool.end();
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
  }

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(globalForPrisma.pool! as any);
    globalForPrisma.prisma = new PrismaNodeClient({
      adapter,
      log: ["query", "error", "warn"],
    });
  }

  prisma = globalForPrisma.prisma;
}

// 🔥 Hot reload safe
if (!isProduction) {
  globalForPrisma.prisma = prisma;
}

export default prisma;