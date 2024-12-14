import { getActiveSubjects } from "@/lib/services/subjects";

/**
 * Active Subjects Route 📚
 * 
 * Handles GET /api/subjects/active
 * Returns only subjects that have tutors teaching them
 * 
 * Why two exports at the top?
 * ---------------------------
 * Next.js caching controls:
 * - dynamic: "force-dynamic"    → Don't cache this route at build time
 * - fetchCache: "force-no-store" → Don't cache responses in the browser
 * 
 * Why? Because tutor availability changes frequently!
 */

// Tell Next.js: "This route's data changes often"
export const dynamic = "force-dynamic"; // Don't cache this route at build time because it changes often
export const fetchCache = "force-no-store"; // Don't cache responses in the browser because they change often

export async function GET() {
  try {
    // Ask the subjects service for currently taught subjects
    const activeSubjects = await getActiveSubjects();
    return Response.json(activeSubjects);
  } catch (error) {
    // Something went wrong - log it and tell the client
    console.error("Error fetching active subjects:", error);
    return Response.json(
      { error: "Failed to fetch active subjects" },
      { status: 500 }
    );
  }
}
