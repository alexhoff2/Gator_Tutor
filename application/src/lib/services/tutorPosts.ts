import { prisma } from "@/lib/prisma";
import { TutorPost, TutorPostsResponse } from "@/lib/types/tutorPost";
import { Prisma } from "@prisma/client";

/**
 * Tutor Posts Service
 *
 * This is our main service for handling tutor listings. It does three big things:
 * 1. Fetches tutor posts with filtering/search/pagination (for search results)
 * 2. Creates new tutor posts (for profile creation)
 * 3. Gets posts for a specific user (for profile pages and dashboards)
 *
 * The Complex Part: Search & Filtering
 * ----------------------------------
 * We support searching by:
 * - Text (name/bio)
 * - Subject
 * - Price range
 * TODO add "for you" recommendations (I have no idea where to start with this)
 * maybe like "students like you" have also taken these subjects? but we dont collect data from students
 *
 * All filters are optional and stack together! (AND logic)
 */

// This is the type for the parameters we pass to the getTutorPosts function
// It will usually get used from like a URL params or something
// (search params like / search ? q = math & subject=math & minPrice=10 & maxPrice=20)
// but that logic is elsewhere.
interface GetTutorPostsParams {
  page?: number; // Which page of results
  pageSize?: number; // How many per page
  q?: string; // Search query
  subject?: string; // Filter by subject
  minPrice?: string; // Price range min
  maxPrice?: string; // Price range max
}

// This is our main search function! I am going to comment extensively because it's a bit complicated.
// a search query piece by piece. Think of it like filling out a form:
// - Maybe you want tutors who teach math
// - Maybe you want ones under $50/hour
// - Maybe you want to search for "experienced" in their bio
// This function handles all of that! 💪
export async function getTutorPosts({
  page = 1, // Which page of results (starts at 1)
  pageSize = 10, // How many results per page
  q, // Search text (looks in name and bio)
  subject, // Filter by subject (like "Math" or "Chemistry")
  minPrice, // Minimum price filter
  maxPrice, // Maximum price filter
}: GetTutorPostsParams = {}): Promise<TutorPostsResponse> {
  try {
    // This is our search filter builder! We're using Prisma's AND array

    // For CSC-648 we were told to just use mysql %LIKE for the search query
    // but with prisma we can have even more control over the query
    // so we just used contains which allows for more complex queries
    // to stack filters together. If a filter isn't provided, we just
    // pass an empty object (which Prisma ignores)

    // So to start we have our where clause which is an AND of all our filters
    const where = {
      AND: [
        // Text search: If there's search text, look for it in name OR bio
        // toLowerCase() makes the search case-insensitive
        q
          ? {
              OR: [
                { displayName: { contains: q.toLowerCase() } },
                { bio: { contains: q.toLowerCase() } },
              ],
            }
          : {},

        // Subject filter: If a subject is specified, find tutors who teach it
        // We need to look through the tutorSubjects relation to find this
        subject
          ? {
              tutorSubjects: {
                some: {
                  // "some" means "at least one matches"
                  subject: {
                    subjectName: subject,
                  },
                },
              },
            }
          : {},

        // Price range: Simple gte (>=) and lte (<=) filters
        // parseFloat converts the string prices to numbers
        minPrice ? { hourlyRate: { gte: parseFloat(minPrice) } } : {},
        maxPrice ? { hourlyRate: { lte: parseFloat(maxPrice) } } : {},
      ],
    };

    // First, count how many total results match our filters
    // We need this for pagination!
    const totalCount = await prisma.tutorPost.count({ where });

    // Now get the actual posts for this page
    // skip/take handles the pagination slicing
    const posts = (await prisma.tutorPost.findMany({
      where,
      skip: (page - 1) * pageSize, // Skip previous pages
      take: pageSize, // Take just this page's worth
      include: {
        // Include the related user's email
        user: {
          select: { email: true },
        },
        // Include the subjects they teach
        tutorSubjects: {
          include: { subject: true },
        },
      },
      orderBy: {
        createdAt: "desc", // Show newest posts first
      },
    })) as unknown as TutorPost[];

    // Return both the posts and the pagination info
    return {
      posts,
      pagination: {
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Error fetching tutor posts:", error);
    throw error;
  }
}

/**
 * Create Tutor Post
 *
 * Takes all the tutor profile data and creates a new listing.
 * Handles:
 * - Basic info (name, bio, rate)
 * - File uploads (photo, video, resume)
 * - Subject connections
 * - Availability schedule
 */
interface CreateTutorPostData {
  userId: number;
  displayName: string;
  bio: string;
  hourlyRate: number;
  contactInfo: string;
  experience: string;
  subjectId: string;
  availability: Record<string, boolean>;
  profilePhoto?: string;
  profileVideo?: string;
  resumePdf?: string;
}

const debugPrismaTypes = () => {
  console.log(
    "Available TutorPost fields:",
    Object.keys(Prisma.TutorPostScalarFieldEnum)
  );
};
debugPrismaTypes();

export async function createTutorPost(data: CreateTutorPostData) {
  // First, verify the user exists
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const tutorPostData = {
    userId: data.userId,
    displayName: data.displayName,
    bio: data.bio,
    hourlyRate: new Prisma.Decimal(data.hourlyRate),
    contactInfo: data.contactInfo,
    experience: data.experience || null,
    availability: data.availability,
    profilePhoto: data.profilePhoto || null,
    profileVideo: data.profileVideo || null,
    resumePdf: data.resumePdf || null,
    tutorSubjects: {
      create: {
        subject: {
          connect: {
            id: parseInt(data.subjectId),
          },
        },
      },
    },
  };

  console.log("Type of tutorPostData:", tutorPostData);

  const tutorPost = await prisma.tutorPost.create({
    data: tutorPostData,
    include: {
      user: {
        select: {
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

  return tutorPost;
}

/**
 * Get Posts by User ID
 *
 * Simple function to fetch all posts for a specific user.
 * Used in profile pages and dashboards.
 * Returns posts newest first.
 */
export async function getTutorPostsByUserId(userId: number) {
  try {
    const posts = await prisma.tutorPost.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        tutorSubjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching tutor posts:", error);
    throw error;
  }
}
