import { createTutorPost } from "@/lib/services/tutorPosts";
import { getSession } from "@/lib/utils/auth";

/**
 * Create Tutor Post Route 👩‍🏫
 *
 * Handles POST /api/tutors/create
 * Lets users create their tutor profile
 *
 * The flow:
 * 1. Verify user is logged in
 * 2. Take their post data
 * 3. Add their user ID from session
 * 4. Create the post (starts as unapproved)
 *
 * !IMPORTANT: User ID comes from session, not request
 * !NOTE: All posts start as unapproved and need admin review
 */
export async function POST(request: Request) {
  try {
    // First, check if user is logged in
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 } // Must be logged in to be a tutor
      );
    }

    // Get the post details from request
    const data = await request.json();

    // Create post with verified user ID (isApproved defaults to false in schema)
    const tutorPost = await createTutorPost({
      userId: session.userId, // Safe: comes from session, not request
      ...data, // Everything else from their form
    });

    return Response.json({
      success: true,
      message:
        "Thank you for submitting your tutor profile! It is currently under review and will be visible once approved (usually within 24 hours).",
      post: tutorPost,
    });
  } catch (error) {
    // Log the full error but send a clean message
    console.error("Create tutor post error:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message // Use error message if it's safe
            : "Failed to create tutor post", // Generic fallback
      },
      { status: 500 }
    );
  }
}
