import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Home Page Component (kinda like the index if you're familiar with that)
 *
 * Landing page with a hero section that:
 * - Centers content vertically (accounting for 80px header)
 * - Features SFSU branding colors (#FFC726 gold, #4B2E83 purple)
 * - Provides clear CTAs for both students and potential tutors
 * - Responsive text sizing using Tailwind breakpoints
 */
export default function HomePage() {
  return (
    <main className="container relative px-4 mx-auto">
      {/* 
        Hero section with vertical centering
        min-h-[calc(100vh-80px)]: Full viewport height minus header
      */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
        {/* 
          Heading with responsive text sizes:
          - Mobile: text-5xl
          - Tablet: text-6xl
          - Desktop: text-7xl
        */}
        <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
          Find Your Perfect
          <span className="block text-[#FFC726]">SFSU Tutor</span>
        </h1>

        {/* 
          Description text with max width for readability
          max-w-2xl: Limits width to maintain comfortable reading length
        */}
        <p className="max-w-2xl mb-8 text-xl text-gray-200">
          Connect with experienced SFU student tutors who can help you excel in
          your studies. Get personalized help in any subject, from math to
          computer science.
        </p>

        {/* 
          CTA buttons that stack on mobile, side-by-side on tablet+
          - Primary: Gold background with purple text
          - Secondary: White outline with hover effect
        */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            className="px-8 py-6 text-lg font-semibold bg-[#FFC726] text-[#4B2E83] hover:bg-[#FFD54F]"
          >
            <Link href="/tutors">Find a Tutor</Link>
          </Button>

          <Button
            asChild
            className="px-8 py-6 text-lg font-semibold text-white border-2 border-white hover:bg-white/10"
            variant="outline"
          >
            <Link href="/become-a-tutor">Become a Tutor</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
