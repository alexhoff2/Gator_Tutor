import { ClientWrapper } from "@/components/features/layout/client-wrapper";
import { DashboardContent } from "@/components/features/dashboard/dashboard-content";

/**
 * Dashboard Page
 *
 * Main user dashboard container that follows the app's consistent layout pattern:
 * - Full-height container with responsive padding
 * - Frosted glass card effect for content
 * - Delegates actual dashboard functionality to DashboardContent component
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      {/* Frosted glass container for dashboard content */}
      <div className="max-w-6xl mx-auto bg-white/75 backdrop-blur-md rounded-3xl p-8 shadow-lg">
        <ClientWrapper>
          <DashboardContent /> {/* The content component itself */}
        </ClientWrapper> 
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
 