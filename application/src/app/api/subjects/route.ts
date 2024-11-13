import { getAllSubjects } from "@/lib/services/subjects";

//Handles GET request for subjects
//List of subjects rarely change opposed to /api/subjects/active
export async function GET() {
  try {
    const subjects = await getAllSubjects();
    return Response.json(subjects);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
