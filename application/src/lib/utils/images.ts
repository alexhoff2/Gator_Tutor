/**
 * Image Path Utility
 *
 * This function standardizes how we handle image paths throughout the app.
 * It's crucial because images can come from different sources:
 * 1. Local uploads (stored in our public directory)
 * 2. External URLs (like S3 or other hosts)
 * 3. Missing images (need a default)
 *
 * Why we need this:
 * - Next.js needs proper path formatting for public assets
 * - External URLs should work without modification
 * - We need a consistent fallback for missing images
 * - Multiple leading slashes can cause routing issues
 */
export function getImagePath(path: string | null): string {
  // If no image path provided, return our default profile picture
  if (!path) return "/images/blank-pfp.png";

  // If it's an external URL (starts with http/https), use it as is
  // This handles images from external sources like S3, CDNs, etc.
  if (path.startsWith("http")) return path;

  // For local images:
  // 1. Remove any number of leading slashes (///image.jpg -> image.jpg)
  // 2. Add back a single leading slash (/image.jpg)
  // This ensures consistent path formatting for Next.js public directory
  const cleanPath = path.replace(/^\/+/, "");
  return `/${cleanPath}`;
}
