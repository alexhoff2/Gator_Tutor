import { getTutorPostsByUserId } from "@/lib/services/tutorPosts";
import { getSession } from "@/lib/utils/auth";
import { TutorPost } from "@/lib/types/tutorPost";

/**
 * My Tutor Posts Route 📋
 *
 * Handles GET /api/tutors/my-posts
 * Shows tutors their own posts (like a personal dashboard)
 * Includes approval status for each post
 *
 * The flow:
 * 1. Check if user is logged in
 * 2. Get their user ID from session
 * 3. Validate the ID (must be a number)
 * 4. Fetch their posts (including approval status)
 *
 * !IMPORTANT: Only shows posts for the logged-in user
 * !NOTE: Shows both approved and unapproved posts
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.userId as string, 10);
    if (isNaN(userId)) {
      return Response.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Fetch all posts (approved and unapproved) for this user
    const posts = await getTutorPostsByUserId(userId);

    return Response.json({
      success: true,
      posts,
      message: posts.some((post: TutorPost) => !post.isApproved)
        ? "Some of your posts are still under review. They will be visible to students once approved."
        : undefined,
    });
  } catch (error) {
    console.error("Get tutor posts error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch tutor posts" },
      { status: 500 }
    );
  }
}
