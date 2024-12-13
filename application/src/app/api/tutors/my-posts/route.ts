import { getTutorPostsByUserId } from "@/lib/services/tutorPosts";
import { getSession } from "@/lib/utils/auth";

/**
 * My Tutor Posts Route 📋
 *
 * Handles GET /api/tutors/my-posts
 * Shows tutors their own posts (like a personal dashboard)
 *
 * The flow:
 * 1. Check if user is logged in
 * 2. Get their user ID from session
 * 3. Validate the ID (must be a number)
 * 4. Fetch their posts
 *
 * !IMPORTANT: Only shows posts for the logged-in user
 * !NOTE: userId comes as string from session, needs conversion
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Make sure someone's logged in
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Convert session's string ID to number
    const userId = parseInt(session.userId as string, 10);
    if (isNaN(userId)) {
      return Response.json(
        { message: "Invalid user ID" },
        { status: 400 } // Bad Request - ID must be a number
      );
    }

    // Fetch all posts for this user
    const posts = await getTutorPostsByUserId(userId);
    return Response.json({
      success: true,
      posts,
    });
  } catch (error) {
    // Log the real error, send generic message
    console.error("Get tutor posts error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch tutor posts" },
      { status: 500 }
    );
  }
}
