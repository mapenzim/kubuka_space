import { PrismaClient as PrismaNodeClient } from "@prisma/client";
import { PrismaClient as PrismaEdgeClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaNodeClient | undefined;
  pool: any;
};

const isProduction = process.env.NODE_ENV === "production";
const connectionString = process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL;

// 🧩 Only initialize PG pool for local dev
if (!isProduction && !globalForPrisma.pool) {
  const pool = new Pool({
    connectionString,
    // ssl: { rejectUnauthorized: false }, // Uncomment if needed
  });

  globalForPrisma.pool = pool;

  // 🩺 Health check
  pool
    .connect()
    .then((client: any) => {
      console.log("✅ PostgreSQL connected successfully.");
      client.release();
    })
    .catch((err: any) => {
      console.error("❌ PostgreSQL connection failed:", err.message);
    });

  // 🧹 Graceful shutdown
  const cleanup = async () => {
    console.log("🧹 Closing PostgreSQL pool...");
    await pool.end();
    process.exit(0);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

let prisma: PrismaNodeClient;

// 🧱 Use Accelerate for production, PG adapter for dev
if (isProduction) {
  const edgePrisma = new PrismaEdgeClient({
    datasourceUrl: connectionString,
  }).$extends(withAccelerate());

  // Cast to `any` for type compatibility — safe for runtime, avoids $on error
  prisma = edgePrisma as unknown as PrismaNodeClient;
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(globalForPrisma.pool);
    globalForPrisma.prisma = new PrismaNodeClient({
      adapter,
      log: ["query", "error", "warn"],
    });
  }
  prisma = globalForPrisma.prisma;
}

// 🧠 Hot reload-safe singleton in dev
if (!isProduction) globalForPrisma.prisma = prisma;

export default prisma;

