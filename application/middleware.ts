import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Authentication Middleware
 *
 * First line of defense for protected API routes:
 * - Checks session cookie before API execution
 * - Returns 401 if no valid session
 * - Works with auth.ts and useAuthProtection for
 *
 * Protected routes:
 * - /api/tutors/create (profile creation)
 * - /api/messages/* (messaging system)
 */
export async function middleware(request: NextRequest) {
  // Define routes needing authentication
  const protectedApiPaths = ["/api/tutors/create", "/api/messages"];

  // Check if current request needs auth
  const isProtectedApiPath = protectedApiPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Verify session exists for protected paths
  if (isProtectedApiPath) {
    const session = request.cookies.get("session");
    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

/**
 * Route Matcher Configuration
 * Defines which paths trigger this middleware
 */
export const config = {
  matcher: ["/api/tutors/create", "/api/messages/:path*"],
};
