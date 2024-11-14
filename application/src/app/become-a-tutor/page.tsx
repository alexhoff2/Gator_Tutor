import { CreateTutorForm } from "@/components/features/tutors/create-tutor-form";

/**
 * Become a Tutor Page 👩‍🏫
 * 
 * The landing spot for users wanting to teach. This page:
 * - Wraps the tutor registration form
 * - Provides a clean, focused UI
 * - Uses visual hierarchy to guide users
 * 
 * Styling details:
 * - Frosted glass container (backdrop-blur-md)
 * - Full-height layout (min-h-screen)
 * - Responsive padding (py-8 px-4)
 * - Centered content (max-w-6xl mx-auto)
 * - Subtle elevation (shadow-lg)
 */
export default function CreateTutorPostPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      {/* Frosted glass container for visual focus */}
      <div className="max-w-6xl mx-auto bg-white/75 backdrop-blur-md rounded-3xl p-8 shadow-lg">
        <CreateTutorForm /> {/* The form component itself */}
      </div>
    </div>
  );
}
