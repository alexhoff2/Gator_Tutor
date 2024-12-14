"use client";

export function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-4xl font-bold text-white mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-gray-200">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
} 