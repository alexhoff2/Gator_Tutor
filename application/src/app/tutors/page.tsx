import { ClientWrapper } from "@/components/features/layout/client-wrapper";
import { TutorList } from "@/components/features/tutors/tutor-list";
import { FilterPanel } from "@/components/features/tutors/filter-panel";

/**
 * Tutors Page Component
 *
 * Main page for displaying all tutors with filtering capabilities:
 * - Uses CSS Grid for a two-column layout on desktop
 * - FilterPanel (300px) on the left
 * - TutorList (flexible width) on the right
 * - Responsive: stacks vertically on mobile (< 768px)
 */
export default function TutorsPage() {
  return (
    <div className="container py-8">
      {/* 
        Grid layout with specific column sizing:
        - md:grid-cols-[300px_1fr]: On desktop, first column is 300px, second takes remaining space
        - items-start: Prevents columns from stretching to match heights 
        - gap-6: Adds spacing between columns and when stacked
      */}
      <div className="grid gap-6 md:grid-cols-[300px_1fr] items-start"> 
        <ClientWrapper>
          <FilterPanel />
        </ClientWrapper>
        <ClientWrapper>
          <TutorList />
        </ClientWrapper>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
