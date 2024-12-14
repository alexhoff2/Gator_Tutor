import { writeFile } from "fs/promises"; // Node's promise-based file writing
import path from "path"; // Node's path manipulation utility

/**
 * File Upload Utility
 *
 * Handles saving uploaded files to our server's public directory.
 * Works with three types of files:
 * - images (profile photos)
 * - videos (tutor intro videos)
 * - pdfs (resumes/CVs)
 */
export async function saveFile(
  file: File, // The uploaded file
  type: "images" | "videos" | "pdfs" // Which subdirectory to use
): Promise<string> {
  // Convert the file to a format we can write to disk
  const bytes = await file.arrayBuffer(); // Get raw bytes
  const buffer = new Uint8Array(bytes); // Convert to Uint8Array

  // Create unique filename using timestamp to prevent collisions
  // Example: 1647293444321-profile.jpg
  // TODO: Add a random component to prevent rare collisions when many users upload at the same time?
  // TODO: Add a hash of the file contents to further prevent collisions?
  const filename = `${Date.now()}-${file.name}`;

  // Build the full file path:
  // 1. Get the project root directory
  const publicDir = path.join(process.cwd(), "public");
  // 2. Add the type subdirectory (images/videos/pdfs)
  const uploadDir = path.join(publicDir, type);
  // 3. Add the filename
  const filePath = path.join(uploadDir, filename);

  // Write the file to disk
  await writeFile(filePath, buffer);

  // Return the public URL path that the browser can use
  // Example: /images/1647293444321-profile.jpg
  return `/${type}/${filename}`;
}
