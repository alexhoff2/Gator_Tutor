import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Classname Utility (cn)
 *
 * This function combines multiple class names intelligently:
 * - Merges Tailwind classes without conflicts
 * - Handles conditional classes
 * - Resolves class name collisions
 *
 * Example usage:
 * cn(
 *   "base-class",
 *   isActive && "active-class",
 *   isBig ? "text-lg" : "text-sm"
 * )
 *
 * Why we need this:
 * 1. Tailwind classes can conflict (e.g., text-red-500 text-blue-500)
 * 2. Dynamic classes need to be combined cleanly
 * 3. Conditional rendering needs to be handled
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
