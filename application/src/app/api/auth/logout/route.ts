import { cookies } from "next/headers";

/**
 * Logout API Route 👋
 * 
 * Handles POST /api/auth/logout
 * The simplest route in our app - it just needs to:
 * 1. Delete the session cookie
 * 2. Tell the client "all done!"
 * 
 * !NOTE: No need to invalidate the JWT - it'll expire on its own
 * !IMPORTANT: Client should still clear any local user state
 */
export async function POST() {
  // Goodbye, cookie! 🍪
  cookies().delete("session");
  
  // That's it! We're logged out
  return Response.json({ success: true });
}
