"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TutorPost } from "@/lib/types/tutorPost";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SendMessage } from "@/components/features/messages/send-message";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [isMessaging, setIsMessaging] = useState(false);

  function handleViewInfo() {
    window.open(`/tutors/${tutor.id}`, "_blank");
  }

  return (
    <>
      <motion.div className="h-full">
        <Card className="overflow-hidden h-full flex flex-col transition-transform duration-200 hover:scale-[1.02] border-0">
          {/* Profile Image */}
          <div className="relative w-[calc(100%+4px)] -ml-[2px] -mt-[2px] pt-[80%]">
            <Image
              src={getImagePath(tutor.profilePhoto)}
              alt={tutor.displayName}
              fill
              className="object-cover object-center object-position-top"
              style={{ objectPosition: "50% 30%" }}
              onError={(e) => {
                e.currentTarget.src = "/images/blank-pfp.png";
              }}
            />
          </div>

          {/* Content Section */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Tutor Info */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{tutor.displayName}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tutor.tutorSubjects.map(({ subject }) => (
                    <Badge
                      key={subject.id}
                      variant="secondary"
                      className="bg-gray-200 hover:bg-gray-300"
                    >
                      {subject.subjectName}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#4B2E83] flex items-baseline justify-end">
                  ${Number(tutor.hourlyRate).toFixed(2)}
                  <span className="text-sm ml-1">/hr</span>
                </div>
                {tutor.reviews && (
                  <div className="text-sm text-gray-500">
                    ⭐ {tutor.reviews} reviews
                  </div>
                )}
              </div>
            </div>

            {/* Title and Bio Section */}
            <div className="text-gray-600">
              <h2 className="text-base mb-2">{tutor.title}</h2>
              <p className="line-clamp-3 mb-4 flex-1">{tutor.bio}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-auto">
              <Button
                onClick={() => setIsMessaging(true)}
                variant="outline"
                className="flex-1 border-[#4B2E83] text-[#4B2E83] hover:bg-[#4B2E83]/10"
              >
                Message
              </Button>
              <Button
                onClick={handleViewInfo}
                className="flex-1 bg-[#4B2E83] hover:bg-[#3b2566] text-white"
              >
                More details
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <Dialog open={isMessaging} onOpenChange={setIsMessaging}>
        <DialogContent className="sm:max-w-[425px] bg-[#f8f9fa]">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setIsMessaging(false)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              Message {tutor.displayName}
            </h2>
          </div>
          <SendMessage
            recipientId={tutor.id}
            tutorPostId={tutor.id}
            onSent={() => setIsMessaging(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}