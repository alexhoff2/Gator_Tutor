"use client";

import { CreateTutorForm } from "@/components/features/tutors/create-tutor-form";

export function CreateTutorPageContent() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white/75 backdrop-blur-md rounded-3xl p-8 shadow-lg">
        <CreateTutorForm />
      </div>
    </div>
  );
}
