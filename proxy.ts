// Next.js 16 discovers request guards from proxy.ts.
import { middleware as authenticationProxy } from "./middleware/index";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return authenticationProxy(request);
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
