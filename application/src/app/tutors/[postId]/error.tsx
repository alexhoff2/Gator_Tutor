"use client"; // Marks this as a client component for error handling

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Error Boundary Component for Tutor Post Pages
 *
 * Displays when an error occurs while loading a specific tutor post.
 * Provides a reset option to attempt reloading the page.
 */
export default function Error({
  error, // The error object containing details about what went wrong
  reset, // Function provided by Next.js to retry rendering the page
}: {
  error: Error & { digest?: string }; // digest is a Next.js-specific error ID
  reset: () => void;
}) {
  // Log the error to console for debugging
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      {/* Reset button using UW purple color scheme */}
      <Button
        onClick={() => reset()}
        className="bg-[#4B2E83] text-white hover:bg-[#4B2E83]/90"
      >
        Try again
      </Button>
    </div>
  );
}
