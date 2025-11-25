import { PrismaClient as PrismaNodeClient } from "@prisma/client";
import { PrismaClient as PrismaEdgeClient } from "@prisma/client/edge";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaNodeClient | undefined;
  pool: any;
};

const isProduction = process.env.NODE_ENV === "production";
const connectionString =
  process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL;

// 🧩 Create pool for dev only (Node runtime)
if (!isProduction && !globalForPrisma.pool) {
  const pool = new Pool({
    connectionString,
  });

  globalForPrisma.pool = pool;

  // Health check
  pool
    .connect()
    .then((client: any) => {
      console.log("✅ PostgreSQL connected successfully.");
      client.release();
    })
    .catch((err: any) => {
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

let prisma: PrismaNodeClient;

// 🏭 Production = Accelerate (Edge-safe)
if (isProduction) {
  prisma = new PrismaEdgeClient({
    accelerateUrl: process.env.ACCELERATE_URL!,
  }) as unknown as PrismaNodeClient;
}

// 🧱 Development = PostgreSQL adapter via pg.Pool
else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(globalForPrisma.pool);

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
