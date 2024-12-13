import { getTutorPosts } from "@/lib/services/tutorPosts";

/**
 * Tutor Search Route 🔍
 *
 * Handles GET /api/tutors
 * The main search endpoint for finding tutors
 *
 * Supported filters:
 * - q: Search terms (name, bio, etc)
 * - subject: Specific subject they teach
 * - page: For pagination (defaults to 1)
 * - minPrice: Minimum hourly rate
 * - maxPrice: Maximum hourly rate
 *
 * Example: /api/tutors?subject=math&minPrice=20&maxPrice=50
 *
 * !NOTE: All filters are optional
 * !NOTE: Price filters use hourly rates
 */
export async function GET(request: Request) {
  // Extract search parameters from URL
  const { searchParams } = new URL(request.url);
  //URL knows how to parse the query string
  //example: /api/tutors ? subject = math & minPrice=20 & maxPrice=50 becomes an object

  // Parse each filter (undefined if not provided)
  const q = searchParams.get("q") || undefined;
  const subject = searchParams.get("subject") || undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;

  try {
    // Ask the service to find matching tutors
    const data = await getTutorPosts({
      q,
      subject,
      page,
      minPrice,
      maxPrice,
    });
    return Response.json(data); // Return the data as a JSON response, (for the inner workings check the service)
  } catch (error) {
    // Log the real error, send generic message
    console.error("Tutor posts error:", error);
    return Response.json(
      { error: "Failed to fetch tutor posts" },
      { status: 500 }
    );
  }
}
