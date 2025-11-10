import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

// Define route access rules per role
const ROLE_ACCESS = {
  ADMIN: ["/dashboard"],
  EDITOR: ["/dashboard/posts", "/dashboard/comments"],
  SUPERUSER: ["/dashboard", "/api/dashboard"],
};

const prisma = new PrismaClient();

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/authentication", req.url);

      loginUrl.searchParams.set("callbackUrl", req.url);

      return NextResponse.redirect(loginUrl);
    }

    if (token?.exp && Date.now() >= token.exp * 1000) {
      const loginUrl = new URL("/authentication", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Get user role from token
    const userRole = token.role as string;

    if (!userRole) {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }

    try {
      // Fetch all allowed paths for this role 
      const role = await prisma.role.findUnique({
        where: { name: userRole },
        include: { permissions: true },
      });

      const allowedPaths = role?.permissions.map((p: { path: any; }) => p.path) || [];

      const hasAccess = allowedPaths.some((path: string) => pathname.startsWith(path));

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/not-authorized", req.url));
      }
    } catch (err) {
      console.error("Middleware role check failed:", err);
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }

  }

  // 2️⃣ Prevent logged-in users from seeing /authentication
  if (pathname.startsWith("/authentication")) {
    if (token) {
      // You can customize where they go (e.g., role-based)
      const redirectUrl =
        token.role === "ADMIN"
          ? "/dashboard"
          : token.role === "EDITOR"
          ? "/dashboard/posts"
          : "/dashboard"; // default user route

      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/authentication/:path*",]
}
