"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TutorPost } from "@/lib/types/tutorPost";

/**
 * Tutor Card Component 🎨
 *
 * An interactive card component that displays tutor information with:
 * - 3D hover effects
 * - Responsive layout
 * - Image handling
 * - Shimmer animations
 *
 * !IMPORTANT: Uses perspective transforms for 3D effects
 */

interface TutorCardProps {
  tutor: TutorPost;
}

/**
 * Image Path Helper
 *
 * Handles different types of image paths:
 * - External URLs (http/https)
 * - Absolute paths (starting with /)
 * - Relative paths
 *
 * @param profilePhoto - The profile photo path
 * @returns Normalized image path
 */
function getImagePath(profilePhoto: string | null) {
  if (!profilePhoto) return "/images/blank-pfp.png";
  if (profilePhoto.startsWith("http")) return profilePhoto;
  if (profilePhoto.startsWith("/")) return profilePhoto;
  return `/${profilePhoto}`;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  // Track rotation for 3D effect
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  /**
   * Mouse Movement Handler
   *
   * Creates 3D rotation effect based on cursor position:
   * - Calculates cursor position relative to card center
   * - Applies rotation transforms
   * - Smooths movement with transition
   *
   * !IMPORTANT: Uses perspective transform for realistic 3D
   * TODO This should eventually be in a shared component I was just lazy :P
   */
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Calculate cursor position relative to card center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles
    const rotateX = -(y - centerY) / 40; // Inverted for natural feel
    const rotateY = (x - centerX) / 160; // Reduced for subtle effect

    setRotation({ x: rotateX, y: rotateY });
  }

  /**
   * Mouse Leave Handler
   *
   * Resets card rotation to original position
   * Transition handled by CSS
   */
  function handleMouseLeave() {
    setRotation({ x: 0, y: 0 });
  }

  /**
   * Profile View Handler
   *
   * Direct navigation to preserve 3D transform during transition
   */
  function handleViewProfile() {
    window.location.href = `/tutors/${tutor.id}`;
  }

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group p-4 transition-all duration-300 ease-out 
      hover:bg-slate-50/80 hover:shadow-lg
      relative overflow-hidden
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] before:animate-[shimmer_3s_infinite]
      before:opacity-0 before:group-hover:opacity-100
      before:transition-opacity before:duration-300"
      style={{
        transform: `
          perspective(2000px) 
          rotateX(${rotation.x}deg) 
          rotateY(${rotation.y}deg)
          scale(${rotation.x || rotation.y ? 1.005 : 1})
        `,
      }}
    >
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Profile Image Section */}
        <Avatar className="w-full md:w-[180px] h-[180px] rounded-2xl shrink-0">
          <AvatarImage
            src={getImagePath(tutor.profilePhoto)}
            alt={tutor.displayName}
            className="object-cover rounded-2xl"
            onError={(e) => {
              e.currentTarget.src = "/images/blank-pfp.png";
            }}
          />
          <AvatarFallback className="text-2xl rounded-2xl">
            {tutor.displayName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Tutor Information Section */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Name and Subjects */}
            <div>
              <h3 className="text-xl font-semibold truncate">
                {tutor.displayName}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {tutor.tutorSubjects.map(({ subject }) => (
                  <Badge key={subject.id} variant="secondary">
                    {subject.subjectName}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Pricing and Reviews */}
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-[#4B2E83]">
                ${Number(tutor.hourlyRate).toFixed(2)}/hr
              </div>
              {tutor.reviews && (
                <div className="text-sm text-gray-500">
                  ⭐ {tutor.reviews} reviews
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <p className="mt-4 text-gray-600 line-clamp-3">{tutor.bio}</p>

          {/* Footer Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mt-4">
            <div className="text-sm text-gray-500">
              Experience: {tutor.experience || "Not specified"}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleViewProfile}
                className="bg-slate-100 text-[#4B2E83] px-4 py-2 rounded-md font-semibold 
                hover:bg-slate-200 transition-colors shrink-0"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
