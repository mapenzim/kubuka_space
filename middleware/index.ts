import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isExpired(token: { exp?: number } | null) {
  return Boolean(token?.exp && Date.now() >= token.exp * 1000);
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token || isExpired(token)) {
      const loginUrl = new URL("/authentication", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "ADMIN" && token.role !== "SUPERUSER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token || isExpired(token)) {
      const loginUrl = new URL("/authentication", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = token.role as string;
    if (!userRole) return NextResponse.redirect(new URL("/not-authorized", req.url));

    try {
      const permissionsResponse = await fetch(new URL("/api/authorization/permissions", req.url), {
        headers: { cookie: req.headers.get("cookie") ?? "" },
        cache: "no-store",
      });
      const { paths: allowedPaths = [] } = await permissionsResponse.json() as { paths?: string[] };
      const hasAccess = allowedPaths.some(
        path => pathname === path || pathname.startsWith(`${path}/`)
      );

      if (!hasAccess) {
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
  matcher: ["/admin/:path*", "/dashboard/:path*", "/authentication/:path*", "/profile/:path*"],
};
