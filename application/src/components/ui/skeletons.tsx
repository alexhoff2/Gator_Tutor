import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-4" />
        <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-96 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Picture Skeleton */}
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 rounded-full bg-gray-200" />
          </div>

          {/* File Upload Skeletons */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-40 w-full bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-7 w-48 bg-gray-200 rounded mb-6" />
            <div className="space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-24 bg-gray-200 rounded" />
                  <div className="h-11 w-full bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-7 w-32 bg-gray-200 rounded mb-6" />
            <div className="grid grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-center mt-10">
        <div className="h-14 w-48 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
