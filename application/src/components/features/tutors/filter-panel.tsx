"use client";

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
import { useURLState } from "@/lib/context/url-state-context";
import { useCallback } from "react";

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
  const { getParam, setParams, clearParams } = useURLState();
  const { activeSubjects } = useSubjects();
  const { priceRange, loading, initialLoad, allPosts } = useTutorPosts();

  // Memoize current values to prevent unnecessary re-renders
  const currentValues = {
    minRate: Number(getParam("minRate") ?? priceRange.min),
    maxRate: Number(getParam("maxRate") ?? priceRange.max),
    subject: getParam("subject") ?? "all",
  };

  const handleRateChange = useCallback(
    ([min, max]: number[]) => {
      setParams({
        minRate: min.toString(),
        maxRate: max.toString(),
      });
    },
    [setParams]
  );

  const handleSubjectChange = useCallback(
    (value: string) => {
      setParams({
        subject: value === "all" ? null : value,
      });
    },
    [setParams]
  );

  /**
   * Filter Reset Handler
   *
   * Removes all filter parameters by:
   * - Navigating to base path
   * - Preserving other URL parameters
   */
  const clearFilters = () => {
    clearParams();
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
                value={[currentValues.minRate, currentValues.maxRate]}
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
            value={currentValues.subject}
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
