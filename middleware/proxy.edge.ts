import "dotenv/config";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { ulid } from "ulid";

// const prisma = new PrismaClient().$extends(withAccelerate());
export const dynamic = "force-dynamic";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

const prisma = new PrismaClient().$extends(withAccelerate());

function redirect(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, req.url));
}

function isExpired(token: any) {
  return token?.exp && Date.now() >= token.exp * 1000;
}

const roleCache = new Map<string, string[]>();

async function getRolePermissions(roleName: string) {
  if (roleCache.has(roleName)) return roleCache.get(roleName)!;
  const role = await prisma.role.findUnique({
    where: { name: roleName },
    include: { permissions: true },
  });
  const paths = role?.permissions.map(p => p.path) || [];
  roleCache.set(roleName, paths);
  return paths;
}

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: authSecret,
    secureCookie: process.env.NODE_ENV === "production" || req.nextUrl.protocol === "https:",
  });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token || isExpired(token)) return redirect(req, "/authentication");
    if (token.role !== "ADMIN" && token.role !== "SUPERUSER") {
      return redirect(req, "/");
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token || isExpired(token)) {
      return redirect(req, "/authentication");
    }

    const userRole = token.role as string;
    if (!userRole) return redirect(req, "/not-authorized");

    try {
      const allowedPaths = await getRolePermissions(userRole);
      const hasAccess = allowedPaths.some(
        path => pathname === path || pathname.startsWith(`${path}/`)
      );

      if (!hasAccess) {
        await prisma.log.create({
          data: {
            id: ulid(),
            action: "UNAUTHORIZED_ACCESS",
            details: { pathname, userRole },
          },
        });
        return redirect(req, "/not-authorized");
      }
    } catch (err) {
      console.error("⚠️ Middleware role check failed:", err);
      return redirect(req, "/not-authorized");
    }
  }

  if (pathname.startsWith("/profile") && (!token || isExpired(token))) {
    return redirect(req, "/authentication");
  }

  // Prevent logged-in users from accessing /authentication
  if (pathname.startsWith("/authentication") && token) {
    const redirectUrl =
      token.role === "ADMIN" || token.role === "SUPERUSER"
        ? "/admin"
        : token.role === "EDITOR"
        ? "/admin/posts"
        : "/";
    return redirect(req, redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/authentication/:path*", "/profile/:path*"],
};
