import { getAllSubjects } from "@/lib/services/subjects";

/**
 * All Subjects Route 📚
 * 
 * Handles GET /api/subjects
 * Returns every subject in our system, whether taught or not
 * 
 * Unlike /subjects/active:
 * - No special caching rules (subjects list rarely changes)
 * - No authentication needed (public data)
 * - Simple error handling (non-sensitive data)
 * 
 * Used by:
 * - Tutor signup (they can teach any subject)
 */
export async function GET() {
  try {
    // Fetch the complete subject catalog
    const subjects = await getAllSubjects();
    return Response.json(subjects);
  } catch (error) {
    // Simple error response (it's just public data)
    return Response.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
