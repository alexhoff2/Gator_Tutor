import { saveFile } from "@/lib/utils/upload";
import { requireAuth } from "@/lib/utils/auth";

/**
 * File Upload Route 📤
 * 
 * Handles POST /api/upload
 * Securely stores user-uploaded files
 * 
 * Accepts:
 * - file: The actual file data
 * - type: "images" | "videos" | "pdfs"
 * 
 * Returns:
 * - path: Where the file was stored
 * 
 * !IMPORTANT: Must be logged in to upload
 * !NOTE: File type determines storage location
 */
export async function POST(request: Request) {
  try {
    // First, make sure user is logged in
    await requireAuth();

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as "images" | "videos" | "pdfs";

    // No file? No service!
    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Hand off to upload utility for storage (/lib/utils/upload) bye bye file 👋
    const filePath = await saveFile(file, type);
    return Response.json({ path: filePath }); // Return the path to the file for the service to use
  } catch (error) {
    // Log the real error, send generic message
    console.error("Upload error:", error);
    return Response.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
