import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (!token || (token.exp && Date.now() >= token.exp * 1000)) {
      const loginUrl = new URL("/authentication", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = token.role as string;
    if (!userRole) return NextResponse.redirect(new URL("/not-authorized", req.url));

    try {
      const role = await prisma.role.findUnique({
        where: { name: userRole },
        include: { permissions: true },
      });

      const allowedPaths = role?.permissions.map(p => p.path) || [];
      const hasAccess = allowedPaths.some(
        path => pathname === path || pathname.startsWith(`${path}/`)
      );

      if (!hasAccess) {
        await prisma.log.create({
          data: {
            action: "UNAUTHORIZED_ACCESS",
            details: { pathname, userRole },
          },
        });
        return NextResponse.redirect(new URL("/not-authorized", req.url));
      }
    } catch (err) {
      console.error("⚠️ Middleware role check failed:", err);
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }
  }

  if (pathname.startsWith("/authentication") && token) {
    const redirectUrl =
      token.role === "ADMIN"
        ? "/dashboard"
        : token.role === "EDITOR"
        ? "/dashboard/posts"
        : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/authentication/:path*", "/profile/:path*"],
};