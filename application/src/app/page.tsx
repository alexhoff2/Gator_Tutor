import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense>
      <main className="container relative px-4 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Find Your Perfect
            <span className="block text-[#FFC726]">SFSU Tutor</span>
          </h1>

          <p className="max-w-2xl mb-8 text-xl text-gray-200">
            Connect with experienced SFU student tutors who can help you excel
            in your studies. Get personalized help in any subject, from math to
            computer science.
          </p>

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
              <Link href="/become-a-tutor">Create Tutor Post</Link>
            </Button>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
