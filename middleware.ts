import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/authentication", req.url);

      loginUrl.searchParams.set("callbackUrl", req.url);

      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/not-authorized", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
}
