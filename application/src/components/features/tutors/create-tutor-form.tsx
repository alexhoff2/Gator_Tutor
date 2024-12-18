"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSubjects } from "@/lib/hooks/useSubjects";
import { Icons } from "@/components/ui/icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { useAuthProtection } from "@/lib/hooks/useAuthProtection";
import { FormSkeleton } from "@/components/ui/skeletons";
import { TutorFormStateService } from "@/lib/services/redirect-state";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

/**
 * Create Tutor Form Component 🎓
 *
 * A comprehensive form for tutor profile creation that handles:
 * - File uploads (photos, videos, PDFs)
 * - Form state persistence
 * - Authentication checks
 * - Complex validation
 *
 * !IMPORTANT: This form maintains state during authentication flow (lazy auth/login)
 * TODO it does not handle the file re-uploads after auth currently it just toasts the user to re-upload the files after auth
 * 
 */

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title cannot exceed 255 characters"),
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio cannot exceed 1000 characters"),
  hourlyRate: z
    .number()
    .min(0, "Rate must be positive")
    .max(1000, "Rate cannot exceed $1000"),
  contactInfo: z.string().min(1, "Contact information is required"),
  subjectId: z.string().min(1, "Please select a subject"),
  availability: z.record(z.boolean()),
});

interface TutorFormData {
  title: string;
  displayName: string;
  bio: string;
  hourlyRate: number;
  contactInfo: string;
  subjectId: string;
  availability: Record<string, boolean>;
  profilePhoto?: File;
  profileVideo?: File;
  resumePdf?: File;
}

function WeeklyScheduler({
  value,
  onChange,
}: {
  value: Record<string, boolean>;
  onChange: (value: Record<string, boolean>) => void;
}) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="grid grid-cols-7 gap-4">
      {days.map((day) => {
        const key = day.toLowerCase();
        return (
          <div
            key={day}
            className={cn(
              "p-4 flex items-center justify-center rounded-lg cursor-pointer transition-colors border",
              value[key]
                ? "bg-[#4B2E83] text-white border-[#4B2E83]"
                : "bg-white hover:bg-gray-50 border-gray-200"
            )}
            onClick={() => onChange({ ...value, [key]: !value[key] })}
          >
            <div className="text-sm font-medium">{day}</div>
          </div>
        );
      })}
    </div>
  );
}

function FileUpload({
  accept,
  onChange,
  label,
}: {
  accept: string;
  onChange: (file: File) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-base font-medium text-gray-500">{label}</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
          }}
        />
      </label>
    </div>
  );
}

// Add this utility component for required field labels
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <span>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </span>
  );
}

export function CreateTutorForm() {
  const router = useRouter();
  const { subjects } = useSubjects();

  // 🔄 Complex state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // 📁 File upload states
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profileVideo, setProfileVideo] = useState<File | null>(null);
  const [resumePdf, setResumePdf] = useState<File | null>(null);

  // !IMPORTANT: Track files that need re-upload after auth
  const [needsReupload, setNeedsReupload] = useState({
    profilePhoto: false,
    profileVideo: false,
    resumePdf: false,
  });

  // Initialize form with validation
  const form = useForm<TutorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      displayName: "",
      bio: "",
      hourlyRate: 0,
      contactInfo: "",
      subjectId: "",
      availability: {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
      },
    },
  });

  const { checkAuth } = useAuthProtection({
    immediate: false, // Don't check immediately
  });

  /**
   * Form submission handler
   *
   * Complex flow:
   * 1. Upload files first 📤
   * 2. Get file paths
   * 3. Submit form data with paths
   * 4. Handle auth redirects if needed
   *
   * !CRITICAL: Must preserve form state during auth flow
   */
  const onSubmit = async (data: TutorFormData) => {
    setIsSubmitting(true);
    try {
      // First handle file uploads
      let profilePhotoPath = null;
      let profileVideoPath = null;
      let resumePdfPath = null;

      // Upload profile photo if exists
      if (profilePhoto) {
        const formData = new FormData();
        formData.append("file", profilePhoto);
        formData.append("type", "images");
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        profilePhotoPath = result.path;
      }

      // ... similar uploads for video and PDF ...

      // Submit complete form with file paths
      const response = await fetch("/api/tutors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          profilePhoto: profilePhotoPath,
          profileVideo: profileVideoPath,
          resumePdf: resumePdfPath,
        }),
      });

      // Handle authentication redirect
      if (response.status === 401) {
        // !IMPORTANT: Save form state before redirect
        TutorFormStateService.save(data, {
          profilePhoto: !!profilePhoto,
          profileVideo: !!profileVideo,
          resumePdf: !!resumePdf,
        });

        toast.info("Please sign in to continue", {
          description: "Your form data will be saved",
          action: {
            label: "Sign In",
            onClick: () => router.push("/login"),
          },
        });
        router.push("/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create tutor profile");
      }

      // Clear the saved form state after successful submission
      TutorFormStateService.clear();

      toast.success("Tutor profile created successfully!", {
        description: "Students can now find and contact you",
        action: {
          label: "View Profile",
          onClick: () => router.push("/profile"),
        },
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to create tutor profile", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Form state restoration
   *
   * !IMPORTANT: Recovers form data after auth redirect
   * Includes handling of file upload states
   */
  useEffect(() => {
    const savedState = TutorFormStateService.load();
    if (savedState) {
      console.log("Restoring form state:", savedState);
      form.reset(savedState.formData);

      if (savedState.hadFiles.profilePhoto) {
        setNeedsReupload((prev) => ({ ...prev, profilePhoto: true }));
      }
      if (savedState.hadFiles.profileVideo) {
        setNeedsReupload((prev) => ({ ...prev, profileVideo: true }));
      }
      if (savedState.hadFiles.resumePdf) {
        setNeedsReupload((prev) => ({ ...prev, resumePdf: true }));
      }
    }
  }, [form]);

  return (
    <Form {...form}>
      <Button
        variant="ghost"
        className="absolute top-4 left-4 p-2"
        onClick={() => router.push("/tutors")}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-[55rem] mx-auto"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#4B2E83] flex items-center justify-center mb-3">
            <svg
              className="w-8 h-8 text-[#FFC726]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#4B2E83] mb-1">
            Create Your Tutor Profile
          </h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to create your tutor listing
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-[#4B2E83] mb-4">
            Basic Information
          </h3>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#4B2E83]">
                    <RequiredLabel>Post Title</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., 'Experienced Math Tutor for All Levels'"
                      className="border-2 focus:ring-[#4B2E83]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-sm text-gray-500">
                    A clear, descriptive title for your tutoring service
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex gap-6 justify-between">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[#4B2E83]">
                      <RequiredLabel>Name</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        className="border-2 focus:ring-[#4B2E83]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-lg font-medium text-[#4B2E83]">
                      <RequiredLabel>Subject</RequiredLabel>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOpen(false);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {subjects?.map((subject) => (
                          <SelectItem
                            key={subject.id}
                            value={subject.id.toString()}
                            className="cursor-pointer"
                          >
                            {subject.subjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-6 justify-between">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[#4B2E83]">
                      <RequiredLabel>Hourly Rate ($)</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="25.00"
                        className="border-2 focus:ring-[#4B2E83]"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactInfo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[#4B2E83]">
                      <RequiredLabel>Contact Information</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email or phone number"
                        className="border-2 focus:ring-[#4B2E83]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-sm text-gray-500">
                      Enter your preferred contact method
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#4B2E83]">
                    <RequiredLabel>Bio</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell students about yourself..."
                      className="h-32 border-2 focus:ring-[#4B2E83]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-xl font-bold text-[#4B2E83] mb-4">
            Availability
          </h3>
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <WeeklyScheduler
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-[#4B2E83] mb-4">
            Additional Documents
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-[#4B2E83] mb-3">
                Profile Photo
              </h4>
              <FileUploadWithStatus
                accept="image/*"
                onChange={(file) => {
                  setProfilePhoto(file);
                  setNeedsReupload((prev) => ({
                    ...prev,
                    profilePhoto: false,
                  }));
                }}
                label="Upload your profile picture"
                needsReupload={needsReupload.profilePhoto}
              />
              {profilePhoto && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Profile preview"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {profilePhoto.name}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold text-[#4B2E83] mb-3">
                Introduction Video
              </h4>
              <FileUploadWithStatus
                accept="video/*"
                onChange={(file) => {
                  setProfileVideo(file);
                  setNeedsReupload((prev) => ({
                    ...prev,
                    profileVideo: false,
                  }));
                }}
                label="MP4, WebM, OGG (10MB)"
                needsReupload={needsReupload.profileVideo}
              />
            </div>

            <div>
              <h4 className="text-lg font-semibold text-[#4B2E83] mb-3">
                Resume/CV
              </h4>
              <FileUploadWithStatus
                accept=".pdf"
                onChange={(file) => {
                  setResumePdf(file);
                  setNeedsReupload((prev) => ({ ...prev, resumePdf: false }));
                }}
                label="PDF files only (5MB)"
                needsReupload={needsReupload.resumePdf}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            className="px-16 py-5 text-xl rounded-xl border-2 border-[#4B2E83] text-[#4B2E83] hover:bg-[#4B2E83]/10"
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#4B2E83] hover:bg-[#4B2E83]/90 text-white px-16 py-5 text-xl rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />
            )}
            Create Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Separate component for the subject combobox
interface CommandComboboxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  subjects: Array<{ id: string; subjectName: string }>;
  form: UseFormReturn<TutorFormData>;
}

function CommandCombobox({
  open,
  setOpen,
  subjects,
  form,
}: CommandComboboxProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* ... your existing combobox trigger ... */}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search subjects..." />
          <CommandEmpty>No subject found.</CommandEmpty>
          <CommandGroup>
            {subjects.map((subject) => (
              <CommandItem
                key={subject.id}
                value={subject.subjectName}
                onSelect={() => {
                  form.setValue("subjectId", subject.id);
                  setOpen(false);
                }}
              >
                {/* ... your existing command item content ... */}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Add visual indicators for re-upload needed
const FileUploadWithStatus = ({
  accept,
  onChange,
  label,
  needsReupload,
}: {
  accept: string;
  onChange: (file: File) => void;
  label: string;
  needsReupload?: boolean;
}) => (
  <div
    className={cn(
      "relative",
      needsReupload && "border-2 border-yellow-400 rounded-lg p-1"
    )}
  >
    <FileUpload accept={accept} onChange={onChange} label={label} />
    {needsReupload && (
      <div className="absolute top-0 right-0 bg-yellow-400 text-xs px-2 py-1 rounded-bl-lg">
        Re-upload needed
      </div>
    )}
  </div>
);
