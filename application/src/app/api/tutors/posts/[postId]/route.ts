import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/utils/auth";

/**
 * Delete Tutor Post Route 🗑️
 *
 * Handles DELETE /api/tutors/posts/[postId]
 * Lets tutors remove their posts from the system
 *
 * Security checks:
 * 1. User must be logged in
 * 2. Post must exist
 * 3. Post must belong to user
 *
 * !IMPORTANT: Double verification of ownership
 * Why? To prevent users from deleting others' posts
 */
export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    // Check if user is logged in
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Convert IDs to numbers
    const postId = parseInt(params.postId, 10);
    const userId = parseInt(session.userId as string, 10);

    // First verify that this post belongs to the user
    const post = await prisma.tutorPost.findUnique({
      where: { id: postId },
      select: { userId: true }, // Only fetch what we need
    });

    // Post doesn't exist?
    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Post belongs to someone else?
    if (post.userId !== userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 403 } // 403 = Forbidden (different from 401!)
      );
    }

    // All checks passed - safe to delete
    await prisma.tutorPost.delete({
      where: { id: postId },
    });

    return Response.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    // Log the real error, send generic message
    console.error("Delete tutor post error:", error);
    return Response.json(
      { success: false, message: "Failed to delete tutor post" },
      { status: 500 }
    );
  }
}
