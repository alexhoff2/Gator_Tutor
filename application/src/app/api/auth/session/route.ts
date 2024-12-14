import { getSession } from "@/lib/utils/auth";

/**
 * Session Check Route 🔍
 * 
 * Handles GET /api/auth/session
 * The doorman - tells components if a user is logged in
 * 
 * The flow:
 * 1. Look for a session cookie
 * 2. If found, verify the JWT inside
 * 3. Return user data or null
 * 
 * !IMPORTANT: Always returns 200 OK (even when not logged in)
 * Why? So attackers can't tell the difference between:
 * - No session
 * - Invalid session
 * - Server error
 */
export async function GET() {
  try {
    // Ask utils/auth to check the session cookie
    const session = await getSession();
    
    // No session? That's fine - just tell the client
    if (!session) {
      return Response.json({ user: null });
    }

    // Found a valid session - send back the user data
    return Response.json({ user: session });
  } catch (error) {
    // Something went wrong? Act like nothing happened
    return Response.json({ user: null });
  }
} 