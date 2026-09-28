import type { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  canAccessProtectedPath,
  defaultRouteForRole,
} from "@/lib/rbac/policy";

export const dynamic = "force-dynamic";

export async function middleware(req: NextAuthRequest) {
  const { pathname } = req.nextUrl;
  const sessionUser = req.auth?.user;
  const account = sessionUser?.id
    ? await prisma.user.findUnique({
        where: { id: String(sessionUser.id) },
        select: {
          status: true,
          role: { select: { name: true } },
        },
      })
    : null;
  const accountStatus = sessionUser
    ? account?.status ?? "ARCHIVED"
    : undefined;
  const accountRole = account?.role?.name;

  const redirectToAuthentication = () => {
    const loginUrl = new URL("/authentication", req.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  };

  if (pathname.startsWith("/admin")) {
    if (!sessionUser) {
      return redirectToAuthentication();
    }

    if (accountStatus && accountStatus !== "ACTIVE") {
      return redirectToAuthentication();
    }

    if (!canAccessProtectedPath(accountRole, pathname)) {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!sessionUser) {
      return redirectToAuthentication();
    }

    if (accountStatus && accountStatus !== "ACTIVE") {
      return redirectToAuthentication();
    }

    if (!canAccessProtectedPath(accountRole, pathname)) {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }
  }

  if (pathname.startsWith("/profile")) {
    if (
      !sessionUser ||
      (accountStatus && accountStatus !== "ACTIVE") ||
      !canAccessProtectedPath(accountRole, pathname)
    ) {
      return redirectToAuthentication();
    }
  }

  if (
    (pathname.startsWith("/store/cart") ||
      pathname.startsWith("/store/receipt")) &&
    sessionUser &&
    accountStatus !== "ACTIVE"
  ) {
    return redirectToAuthentication();
  }

  if (
    pathname.startsWith("/authentication") &&
    sessionUser &&
    (!accountStatus || accountStatus === "ACTIVE")
  ) {
    const redirectUrl = defaultRouteForRole(accountRole);
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/authentication/:path*",
    "/profile/:path*",
    "/store/cart/:path*",
    "/store/receipt/:path*",
  ],
};
