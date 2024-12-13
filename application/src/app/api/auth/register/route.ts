import { registerUser, checkUserExists, signIn } from "@/lib/services/auth";
import { RegisterFormData } from "@/lib/types/auth";
import { cookies } from "next/headers";

/**
 * Registration API Route 📝
 *
 * Handles POST /api/auth/register
 * The bouncer at the club - checks everything before letting new users in:
 * We do it in the api route and not the service because we need to set the cookie
 *
 * Validation checklist:
 * 1. All required fields present
 * 2. Must use @sfsu.edu email
 * 3. Passwords match
 * 4. Terms accepted
 * 5. Email not already taken
 *
 * !IMPORTANT: Detailed errors in logs, generic messages to user
 * !NOTE: Auto-login after successful registration
 */
export async function POST(request: Request) {
  try {
    const data: RegisterFormData = await request.json();

    // Log registration attempt (helps debug user issues)
    console.log("Registration attempt details:", {
      email: data.email,
      passwordLength: data?.password?.length,
      confirmPasswordLength: data?.confirmPassword?.length,
      termsAccepted: data.acceptTerms,
      passwordsMatch: data.password === data.confirmPassword,
      emailValid: data.email?.toLowerCase().endsWith("@sfsu.edu"),
    });

    // Check 1: Required fields
    if (!data.email || !data.password || !data.confirmPassword) {
      const missingFields = [];
      if (!data.email) missingFields.push("email");
      if (!data.password) missingFields.push("password");
      if (!data.confirmPassword) missingFields.push("confirmPassword");

      return Response.json(
        {
          success: false,
          message: "Missing required fields",
          fields: missingFields,
        },
        { status: 400 } // 400 = Bad Request
      );
    }

    // Check 2: SFSU email domain
    if (!data.email.toLowerCase().endsWith("@sfsu.edu")) {
      return Response.json(
        { success: false, message: "Email must be an SFSU email address" },
        { status: 400 }
      );
    }

    // Check 3: Matching passwords
    if (data.password !== data.confirmPassword) {
      return Response.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Check 4: Terms accepted
    if (!data.acceptTerms) {
      return Response.json(
        { success: false, message: "You must accept the terms and conditions" },
        { status: 400 }
      );
    }

    // Check 5: Email not taken
    const existingUser = await checkUserExists(data.email.toLowerCase());
    if (existingUser) {
      return Response.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // All checks passed - let's create the account!
    try {
      const result = await registerUser(data);
      if (!result.success) {
        return Response.json(
          { success: false, message: "Registration failed" },
          { status: 400 }
        );
      }

      // Set up their session cookie (just like login)
      cookies().set({
        name: "session",
        value: result.token!,
        httpOnly: true, // No JavaScript access
        secure: process.env.NODE_ENV === "production", // HTTPS in prod
        sameSite: "lax", // CSRF protection
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return Response.json({
        success: true,
        message: "Registration successful",
        user: result.user, // Never includes password
      });
    } catch (regError) {
      // Log details for debugging but send generic message to user
      console.error("Registration service error:", regError);
      return Response.json(
        { success: false, message: "Registration failed" },
        { status: 500 } // 500 = Server Error
      );
    }
  } catch (error) { // Catch any other errors
    console.error("Registration route error:", error);
    return Response.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
