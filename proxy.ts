// Next.js 16 discovers request guards from proxy.ts. Auth.js decodes its own
// cookie, then the application proxy performs the database-backed checks.
import { auth } from "./auth";
import { middleware as authenticationProxy } from "./middleware/index";

export const proxy = auth((request) => authenticationProxy(request));

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
