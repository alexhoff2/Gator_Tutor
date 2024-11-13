import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);


/**
 * getSession(): Validates user's authentication
 *
 * Technical flow:
 * 1. Checks for session cookie
 * 2. Verifies JWT signature using our secret key
 * 3. Returns decoded user data if valid
 *
 * Why cookies?
 * - Automatically sent with every request
 * - Can be httpOnly (more secure)
 * - Standard way to maintain sessions
 */
export async function getSession() {
  const token = cookies().get("session")?.value;

  if (!token) return null;

  try {


    // jwtVerify: Checks signature and expiration
    // Returns decoded payload if valid
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (err) {
    return null; // Invalid or expired token
  }
}


/**
 * requireAuth(): Strict version of getSession
 *
 * Used for protected routes/actions
 * Throws error instead of returning null
 * This forces the calling code to handle authentication failure
 */

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
