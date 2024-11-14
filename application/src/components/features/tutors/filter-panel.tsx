"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSubjects } from "@/lib/hooks/useSubjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DualSlider } from "@/components/ui/dual-slider";
import { useTutorPosts } from "@/lib/hooks/useTutorPosts";
import { PriceDistribution } from "@/components/ui/price-distribution";
import type { TutorPost } from "@/lib/types/tutorPost";

/**
 * Filter Panel Component 🎯
 *
 * A sophisticated filtering system that provides:
 * - Price range selection with visual distribution
 * - Subject filtering with counts
 * - URL-based state management
 * - Real-time updates
 *
 * !IMPORTANT: All filter states are preserved in URL parameters so dont worry about losing the state it handles it for you
 */
export function FilterPanel() {
  // Navigation and URL handling
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Data fetching hooks
  const { activeSubjects } = useSubjects();
  const { priceRange, loading, initialLoad, allPosts } = useTutorPosts();

  // Extract current filter values from URL
  const currentMinRate = Number(searchParams.get("minRate") ?? priceRange.min);
  const currentMaxRate = Number(searchParams.get("maxRate") ?? priceRange.max);
  const currentSubject = searchParams.get("subject") ?? "";

  /**
   * URL Parameter Update Handler
   *
   * !IMPORTANT: Updates URL without page refresh
   *
   * @param updates - Key-value pairs of params to update
   *
   * Example:
   * updateSearchParams({ minRate: "25", maxRate: "50" })
   * => /tutors?minRate=25&maxRate=50
   */
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove parameters based on values
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key); // Remove param if null
      } else {
        params.set(key, value); // Update param value
      }
    });

    // Update URL without full page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  /**
   * Price Range Handler
   *
   * Updates both min and max rate parameters
   * Ensures valid range selection
   */
  const handleRateChange = (values: number[]) => {
    updateSearchParams({
      minRate: values[0].toString(),
      maxRate: values[1].toString(),
    });
  };

  /**
   * Subject Filter Handler
   *
   * Special handling for "all" selection:
   * - Removes subject parameter when "all" is selected
   * - Adds specific subject otherwise
   */
  const handleSubjectChange = (value: string) => {
    updateSearchParams({
      subject: value === "all" ? null : value, // Remove param for "all"
    });
  };

  /**
   * Filter Reset Handler
   *
   * Removes all filter parameters by:
   * - Navigating to base path
   * - Preserving other URL parameters
   */
  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <Card className="p-6 sticky top-4 bg-white/95 backdrop-blur-sm">
      <h2 className="mb-6 text-lg font-semibold">Filters</h2>

      <div className="space-y-8">
        {/* Price Range Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Hourly Rate Range</Label>
          {!initialLoad && allPosts.length > 0 && (
            <div className="space-y-2">
              {/* Visual price distribution chart */}
              <PriceDistribution
                prices={allPosts.map((post: TutorPost) =>
                  Number(post.hourlyRate.toString())
                )}
                className="w-full"
              />
              {/* Dual slider for price range selection */}
              <DualSlider
                value={[currentMinRate, currentMaxRate]}
                min={priceRange.min}
                max={priceRange.max}
                step={1}
                minStepsBetweenThumbs={1}
                onValueChange={handleRateChange}
                className="[&_.bg-primary]:bg-[#4B2E83] [&_[role=slider]]:border-[#4B2E83] [&_[role=slider]]:focus-visible:ring-[#4B2E83]"
              />
            </div>
          )}
        </div>

        {/* Subject Filter Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Subject</Label>
          <Select
            value={currentSubject || "all"}
            onValueChange={handleSubjectChange}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {/* Dynamic subject list with counts */}
              {activeSubjects?.map((subject) => (
                <SelectItem
                  key={subject.id}
                  value={subject.subjectName}
                  className="flex items-center justify-between"
                >
                  <span>{subject.subjectName}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({subject.tutorCount})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed hover:border-solid hover:bg-destructive/5 
          hover:text-destructive hover:border-destructive transition-colors"
          onClick={clearFilters}
        >
          Reset All Filters
        </Button>
      </div>
    </Card>
  );
}
