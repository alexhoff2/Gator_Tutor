import type { Subject } from "./subject";
import type { Prisma } from "@prisma/client";

/**
 * Tutor Post Type
 * 
 * This is the main type for tutor listings. It includes:
 * - Basic info (name, bio, rate)
 * - Contact & availability
 * - Media (photo, video, resume)
 * - Experience & reviews
 * - Related data (user, subjects)
 */
export interface TutorPost {
  // Core post data
  id: number;
  userId: number;
  displayName: string;
  bio: string;
  hourlyRate: Prisma.Decimal;
  contactInfo: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Schedule & availability
  availability: Prisma.JsonValue;  // Stored as JSON in DB
  
  // Optional media files
  profilePhoto: string | null;     // URL to photo
  profileVideo: string | null;     // URL to video
  resumePdf: string | null;        // URL to PDF
  
  // Optional fields
  experience: string | null;       // Text description
  reviews: number | null;          // Review count
  subjects: string | null;         // Legacy field
  
  // Related user data (just basic info)
  user: {
    email: string;
    username?: string;
  };
  
  // Subjects they teach (with relationship data)
  tutorSubjects: {
    subject: Subject;             // The actual subject
    tutorId: number;             // Links to tutor
    subjectId: number;           // Links to subject
  }[];
}

/**
 * Tutor Posts Response
 * 
 * What the API sends back when you request tutor posts:
 * - posts: Array of tutor posts
 * - pagination: Info for paginated results
 *   - totalPages: How many pages total
 *   - currentPage: Which page you're on
 *   - totalCount: Total number of posts
 */
export interface TutorPostsResponse {
  posts: TutorPost[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalCount: number;
  };
}
