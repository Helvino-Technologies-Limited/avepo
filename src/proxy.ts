import { NextResponse } from "next/server";
import { auth } from "@/auth";

// The auth() wrapper's req.nextUrl.origin is unreliable across this app's
// multiple live hosts (avepo.org, avepo.co.ke, preview/vercel.app URLs) —
// it's been observed collapsing to the NextAuth default of
// http://localhost:3000 regardless of trustHost/AUTH_TRUST_HOST. Build the
// origin from the actual request headers instead, which Vercel always sets
// correctly for the host that was hit.
function requestOrigin(req: Parameters<Parameters<typeof auth>[0]>[0]): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? req.nextUrl.host;
  const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const origin = requestOrigin(req);

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin/dashboard", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
