export async function requireRoleServer(req: Request, allowed: string[]) {
  // if using next-auth v4 App Router server route, you can use getServerSession with cookies
  // For a simple example: read token from cookies (or call prisma), but simplest is:
  // Use your own JWT verifying or query DB by session token. Implementation depends on your setup.
  throw new Error("Implement server-side session retrieval for your hosting environment");
}
