import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendMessage } from "@/components/features/messages/send-message";
import { getImagePath } from "@/lib/utils/images";
import Image from "next/image";

/**
 * Individual Tutor Profile Page
 *
 * This is a Next.js dynamic route page that displays a tutor's full profile.
 * The [postId] in the folder name tells Next.js this is a dynamic route,
 * where the URL will be like /tutors/123 (123 being the postId).
 *
 * Key Features:
 * - Server-side rendering with async component
 * - Prisma database queries for tutor information
 * - Responsive layout with mobile-first design
 * - UW branded color scheme (#4B2E83)
 */

// Props interface for the dynamic route parameters
interface PageProps {
  params: {
    postId: string; // Next.js provides URL params as strings
  };
}

export default async function TutorProfilePage({ params }: PageProps) {
  // Convert string ID from URL to number for database query
  const postId = parseInt(params.postId, 10);

  // Handle invalid URL parameters (non-numeric IDs)
  if (isNaN(postId)) {
    notFound(); // Next.js utility to show 404 page
  }

  try {
    // Prisma query to fetch tutor data and related information:
    // - user: Basic user info (id, email)
    // - tutorSubjects: All subjects this tutor teaches
    // - subject: Details about each subject
    const tutorPost = await prisma.tutorPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        tutorSubjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    // If no tutor found with this ID, show 404
    if (!tutorPost) {
      notFound();
    }

    return (
      // Main container with responsive padding and max width
      <div className="container mx-auto py-8 px-4 max-w-5xl space-y-6">
        <Card className="overflow-hidden p-0 border-0">
          {/* Profile header with UW purple gradient background */}
          <div className="bg-[#4B2E83] relative bg-gradient-to-b from-[#4B2E83]/90 to-[#4B2E83] p-8">
            {/* Flex container that stacks on mobile, side-by-side on desktop */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile photo section */}
              <div>
                <div className="rounded-xl overflow-hidden w-56 h-56 relative">
                  <Image
                    src={getImagePath(tutorPost.profilePhoto)}
                    alt={tutorPost.displayName}
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
              </div>

              {/* Tutor information section */}
              <div className="flex-1 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {tutorPost.displayName}
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tutorPost.tutorSubjects.map(({ subject }) => (
                        <Badge
                          key={subject.id}
                          className="bg-white/90 text-[#4B2E83] hover:bg-white"
                        >
                          {subject.subjectName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${Number(tutorPost.hourlyRate).toFixed(2)}/hr
                    </div>
                    {tutorPost.reviews && (
                      <div className="text-sm">
                        ⭐ {tutorPost.reviews} reviews
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">About Me</h2>
                    <p className="text-white/90">{tutorPost.bio}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Experience</h2>
                    <p className="text-white/90">
                      {tutorPost.experience || "No experience specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area with video, resume, and contact form */}
          <div className="p-8">
            {/* Two-column grid on desktop, stacks on mobile */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold text-[#4B2E83] mb-4">
                    Introduction Video
                  </h2>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {tutorPost.profileVideo ? (
                      <video
                        controls
                        className="w-full h-full object-cover"
                        src={tutorPost.profileVideo}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <div className="text-center">
                          <svg
                            className="w-16 h-16 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          <p>No introduction video available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-[#4B2E83] mb-4">
                    Resume
                  </h2>
                  <Card className="p-4">
                    {tutorPost.resumePdf ? (
                      <a
                        href={tutorPost.resumePdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 bg-[#4B2E83]/10 rounded-lg">
                          <svg
                            className="w-6 h-6 text-[#4B2E83]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-[#4B2E83]">Resume</h3>
                          <p className="text-sm text-gray-500">
                            Click to view PDF
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Resume</h3>
                          <p className="text-sm">No resume available</p>
                        </div>
                      </div>
                    )}
                  </Card>
                </section>
              </div>

              <div>
                <section>
                  <h2 className="text-xl font-semibold text-[#4B2E83] mb-4">
                    Contact Tutor
                  </h2>
                  <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow">
                    {/* Contact form component */}
                    <SendMessage
                      recipientId={tutorPost.userId}
                      tutorPostId={tutorPost.id}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  } catch (error) {
    // Log error and let Next.js error boundary handle it
    console.error("Error fetching tutor post:", error);
    throw error;
  }
}
