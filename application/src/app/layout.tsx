import { Header } from "@/components/features/layout/header";
import { Toaster } from "sonner";
import "./globals.css";

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
  children: React.ReactNode; // All page content will be passed as children
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="relative min-h-screen">
          {/* Fixed background image with z-index positioning */}
          <div className="fixed inset-0 -z-10">
            <img
              src="/images/background-poster.jpg"
              alt="Background"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Global header component */}
          <Header /> {/* The header component itself */}

          {/* Page content */}
          {children} {/* The page content itself, it changes based on the page the user is on (pages are auto routed*/}

          {/* Toast notification system
              - Positioned below header (top-[80px])
              - Uses sonner library for notifications
              - Custom styling for consistent design */}
          <Toaster
            className="!fixed !top-[80px] !right-0" // !important used to override default styles
            expand={true} // Allows toasts to expand
            richColors // Enables predefined color schemes
            closeButton // Shows close button on toasts
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
          /> {/* The toast component itself */}
        </div>
      </body>
    </html>
  );
}
