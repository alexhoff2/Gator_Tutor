import { Header } from "@/components/features/layout/header";
import { Toaster } from "sonner";
import "./globals.css";
import Image from "next/image";
import { URLStateProvider } from "@/lib/context/url-state-context";
import { Suspense } from "react";

/**
 * Root Layout Component
 *
 * This is the top-level layout that wraps all pages in the application.
 * It provides:
 * - Common HTML structure
 * - Fixed background image
 * - Global header
 * - Toast notifications system
 */

// Next.js metadata configuration for SEO
export const metadata = {
  title: "GatorTutor",
  description: "Find your perfect tutor at UF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <URLStateProvider>
          <div className="relative min-h-screen">
            {/* Background image */}
            <div className="fixed inset-0 -z-10">
              <Image
                src="/images/background-poster.jpg"
                alt="Background"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <Suspense fallback={<div className="h-16 bg-[#4B2E83]" />}>
              <Header />
            </Suspense>
            <Suspense fallback={<div className="animate-pulse" />}>
              {children}
            </Suspense>
            <Toaster
              className="!fixed !top-[80px] !right-0"
              expand={true}
              richColors
              closeButton
              toastOptions={{
                style: {
                  maxWidth: "600px",
                  padding: "16px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                },
              }}
            />
          </div>
        </URLStateProvider>
      </body>
    </html>
  );
}
