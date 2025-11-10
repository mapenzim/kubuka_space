import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// ✅ Edge-safe Prisma client
const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL,
}).$extends(withAccelerate());

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Protect dashboard routes
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
      console.error("⚠️ Middleware role check failed (EDGE):", err);
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }
  }

  // Prevent logged-in users from accessing /authentication
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
  matcher: ["/dashboard/:path*", "/authentication/:path*"],
};
