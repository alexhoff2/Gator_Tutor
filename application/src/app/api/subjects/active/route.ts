import { getActiveSubjects } from "@/lib/services/subjects";

//Prevents caching since data can change often
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

//Handles GET request for all currently taught subjects
export async function GET() {
  try {
    const activeSubjects = await getActiveSubjects();
    return Response.json(activeSubjects);
  } catch (error) {
    console.error("Error fetching active subjects:", error);
    return Response.json(
      { error: "Failed to fetch active subjects" },
      { status: 500 }
    );
  }
}
