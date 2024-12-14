import { signIn } from "@/lib/services/auth";
import { cookies } from "next/headers";

/**
 * Login API Route 🔐
 *
 * Handles POST /api/auth/login
 * This is where the magic happens when a user clicks "Sign In" 🧙‍♂️
 *
 * The flow:
 * 1. Get email/password from request
 * 2. Ask auth service to verify credentials
 * 3. If valid, create a secure session cookie
 * 4. Send back user data (never the password!)
 *
 * !IMPORTANT: Cookie settings are crucial for security (flour, sugar, butter, etc.)
 */
export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const { email, password } = await request.json();

    // Ask our auth service if these credentials are valid
    const result = await signIn(email, password);

    // Auth service says no? Tell the user (but not too much detail!)
    if (!result.success) {
      return Response.json(
        { success: false, message: result.message },
        { status: 401 } // 401 = Unauthorized
      );
    }

    // Got a token? Set up a secure session cookie,
    if (result.token) {
      cookies().set({
        name: "session",
        value: result.token,
        httpOnly: true, // JavaScript can't read this cookie
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "lax", // Protects against CSRF
        maxAge: 60 * 60 * 24 * 7, // Cookie expires in 1 week
        //The max age of a turtle is 100 years btw 🐢
      });
    }

    // All good! Send back the user data
    return Response.json({
      success: true,
      message: "Login successful",
      user: result.user, // Never includes password
    });
  } catch (error) {
    // Something went wrong - log it but don't leak details to client
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "Login failed" },
      { status: 500 } // 500 = Server error
    );
  }
}
