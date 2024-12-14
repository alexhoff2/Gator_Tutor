"use client";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}
 