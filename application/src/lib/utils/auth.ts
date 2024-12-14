import { cookies } from "next/headers";
import { jwtVerify } from "jose";

/**
 * Authentication Utilities Module
 * ------------------------------
 * @module lib/utils/auth
 * @description Handles JWT-based authentication and session management
 * @lastModified 12-14-2024
 * @author Jack Richards
 * 
 * Key Components:
 * - JWT token validation
 * - Session management
 * - Authentication checks
 * 
 * Security Notes:
 * - Uses httpOnly cookies for XSS protection
 * - Implements JWT for secure token transmission
 * - Requires environment-based secret key
 */

// TextEncoder converts our secret key string into bytes
// (JWT operations need bytes, not strings)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key" // !IMPORTANT: In production, this needs to be a real secret key in .env
);

/**
 * Validates user's authentication session
 * @returns {Promise<Object|null>} Decoded session payload or null if invalid
 * @throws {Error} If JWT verification fails
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
 * Strict authentication check for protected routes
 * @returns {Promise<Object>} Verified session data
 * @throws {Error} If user is not authenticated
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
