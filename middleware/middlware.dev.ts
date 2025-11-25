// middleware/middleware.dev.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

// 🧠 Use a global pool to avoid creating multiple connections during hot reload
const globalForPrisma = globalThis as unknown as {
  pool?: InstanceType<typeof Pool>;
  prisma?: PrismaClient;
};

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5, // limit connections to prevent exhaustion
    idleTimeoutMillis: 10000, // close idle connections
  });
}

// 🧩 Create Prisma client once, reuse it
if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg(globalForPrisma.pool);
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma!;

// 🧹 Handle graceful shutdown (optional but good hygiene)
if (process.env.NODE_ENV === "development") {
  process.once("SIGINT", async () => {
    console.log("🧹 Closing Postgres pool (SIGINT)...");
    await globalForPrisma.pool?.end();
  });
  process.once("SIGTERM", async () => {
    console.log("🧹 Closing Postgres pool (SIGTERM)...");
    await globalForPrisma.pool?.end();
  });
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 🔒 Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/authentication", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (token?.exp && Date.now() >= token.exp * 1000) {
      return NextResponse.redirect(new URL("/authentication", req.url));
    }

    const userRole = token.role as string;

    if (!userRole) {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }

    try {
      const role = await prisma.role.findUnique({
        where: { name: userRole },
        include: { permissions: true },
      });

      const allowedPaths =
        role?.permissions.map((p: { path: string }) => p.path) || [];

      const hasAccess = allowedPaths.some((path: string) =>
        pathname.startsWith(path)
      );

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/not-authorized", req.url));
      }
    } catch (err) {
      console.error("⚠️ Middleware role check failed (DEV):", err);
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }
  }

  // 🚫 Prevent logged-in users from seeing /authentication
  if (pathname.startsWith("/authentication")) {
    if (token) {
      const redirectUrl =
        token.role === "ADMIN"
          ? "/dashboard"
          : token.role === "EDITOR"
          ? "/dashboard/posts"
          : "/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/authentication/:path*", "/profile/:path*"],
};
