import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading State Component for Tutor Post Pages
 *
 * Displays a placeholder layout while the tutor post data is being fetched:
 * - Large skeleton for the main tutor information
 * - Two column grid below for additional content placeholders
 * - Responsive design that stacks on mobile
 */
export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="space-y-4">
        {/* Main content skeleton */}
        <Skeleton className="h-[400px] w-full rounded-xl" />

        {/* Two-column grid for additional content */}
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    </div>
  );
}
