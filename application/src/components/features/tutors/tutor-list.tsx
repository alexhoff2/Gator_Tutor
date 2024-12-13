"use client";

import { useTutorPosts } from "@/lib/hooks/useTutorPosts";
import { TutorCard } from "@/components/features/tutors/tutor-card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Tutor List Component
 *
 * Handles the display of filtered tutor posts with:
 * - Loading states with skeletons
 * - Error handling
 * - Empty state messaging
 * - Responsive grid layout
 *
 * !IMPORTANT: Uses custom hook for data fetching and filter handling
 * TODO: Consider implementing infinite scroll for large result sets
 * TODO: Add a "load more" button to the bottom of the list
 * TODO: Add a "sort by" dropdown to the top of the list (in a new component probably)
 */
export function TutorList() {
  const { posts, loading, error } = useTutorPosts();

  /**
   * Loading State
   *
   * Shows 3 skeleton cards while data is loading
   * Maintains consistent layout during fetch
   */
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  /**
   * Error State
   *
   * Shows error message with details
   * TODO: Add retry mechanism for failed fetches or something akin to that
   */
  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Error loading tutors: {error}
      </div>
    );
  }

  /**
   * Empty State
   *
   * Shows when filters return no results
   * !IMPORTANT: Text color should be adjusted for dark backgrounds
   */
  if (!posts.length) {
    return (
      <div className="py-8 text-center text-white">
        No tutors found matching your criteria
      </div>
    );
  }

  /**
   * Tutor List Display
   *
   * Renders the list of tutor posts
   * makes a grid/list of tutor cards
   * posts.map is used to render each tutor card
   * TODO: Add a "sort by" dropdown to the top of the list (in a new component probably)
   */
  return (
    <div className="grid grid-cols-1 gap-2 md:gap-4 w-full max-w-7xl mx-auto">
      {posts.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}
