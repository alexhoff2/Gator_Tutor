"use client";

import { useTutorPosts } from "@/lib/hooks/useTutorPosts";
import { TutorCard } from "@/components/features/tutors/tutor-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-full aspect-[3/4] rounded-lg" />
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
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-sm text-white mb-6">
        Found {posts.length} {posts.length === 1 ? "result" : "results"}
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        layout
        transition={{ duration: 0.3 }}
      >
        {posts.map((tutor) => (
          <motion.div
            key={tutor.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TutorCard tutor={tutor} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
