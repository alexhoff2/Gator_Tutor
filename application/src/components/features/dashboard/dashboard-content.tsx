"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TutorPost } from "@/lib/types/tutorPost";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Prisma } from "@prisma/client";
import { MessageList } from "@/components/features/dashboard/message-list";

/**
 * Dashboard Content Component
 * 
 * A comprehensive dashboard that manages tutor posts and messages:
 * 
 * 1. State Management
 *    - Handles multiple tutor posts
 *    - Tracks editing and deleting states
 *    - Manages loading states
 *    Why? Provides smooth transitions and feedback for user actions
 * 
 * 2. Data Handling
 *    - Fetches tutor posts from API
 *    - Handles CRUD operations (Create, Read, Update, Delete)
 *    - Manages decimal conversion for hourly rates
 *    Why? Ensures data consistency and type safety
 * 
 * 3. UX Considerations
 *    - Confirmation for deletions
 *    - Loading states with spinners
 *    - Empty state handling
 *    Why? Prevents accidental actions and provides clear feedback
 */

// Type definitions for data structure
interface EditableTutorPost extends Omit<TutorPost, "hourlyRate"> {
  hourlyRate: Prisma.Decimal;  // Special handling for decimal values
}

interface EditingPost {
  hourlyRate: string;
  bio: string;
  experience: string;
}

export function DashboardContent() {
  const router = useRouter();
  const [tutorPosts, setTutorPosts] = useState<TutorPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<EditingPost>({
    hourlyRate: "",
    bio: "",
    experience: "",
  });
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  /**
   * Initial data fetch on component mount
   * - Loads user's tutor posts
   * - Handles loading states
   * - Manages error cases
   */
  useEffect(() => {
    const fetchTutorPosts = async () => {
      try {
        const response = await fetch("/api/tutors/my-posts");
        const data = await response.json();
        if (data.success) {
          setTutorPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching tutor posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutorPosts();
  }, []);

  /**
   * Edit handlers with optimistic updates:
   * - Prepares form for editing
   * - Updates UI immediately
   * - Syncs with backend
   * Why? Provides instant feedback while ensuring data consistency
   */
  const handleEditClick = (post: TutorPost) => {
    setEditingPostId(post.id.toString());
    setEditingValues({
      hourlyRate: post.hourlyRate.toString(),
      bio: post.bio || "",
      experience: post.experience || "",
    });
  };

  const handleSaveEdit = async (postId: string) => {
    try {
      const response = await fetch(`/api/tutors/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hourlyRate: parseFloat(editingValues.hourlyRate),
          bio: editingValues.bio,
          experience: editingValues.experience,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTutorPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id.toString() === postId
              ? {
                  ...post,
                  hourlyRate: new Prisma.Decimal(editingValues.hourlyRate),
                  bio: editingValues.bio,
                  experience: editingValues.experience,
                }
              : post
          )
        );
        setEditingPostId(null);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  /**
   * Delete handlers with confirmation:
   * - Shows confirmation button
   * - Times out after 3 seconds
   * - Removes post on confirmation
   * Why? Prevents accidental deletions
   */
  const handleDeleteClick = (postId: string) => {
    setDeletingPostId(postId);
    setTimeout(() => {
      setDeletingPostId(null);
    }, 3000);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/tutors/posts/${postId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setTutorPosts((prevPosts) =>
          prevPosts.filter((post) => post.id.toString() !== postId)
        );
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Loading state with spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Icons.spinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-3xl font-bold text-[#4B2E83] mb-2">
          My Tutor Posts
        </h1>
        <p className="text-lg text-gray-600">
          Manage your tutor listings and profiles
        </p>
      </div>

      {/* Conditional rendering based on posts existence */}
      {tutorPosts.length > 0 ? (
        <div className="space-y-4">
          {/* Post cards with edit/delete functionality */}
          {tutorPosts.map((post) => (
            <Card
              key={post.id.toString()}
              className="p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="w-24 h-24 shrink-0">
                  <AvatarImage
                    src={post.profilePhoto || "/images/blank-pfp.png"}
                    alt={post.displayName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">
                    {post.displayName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold truncate">
                        {post.displayName}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {post.tutorSubjects.map(({ subject }) => (
                          <Badge key={subject.id} variant="secondary">
                            {subject.subjectName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-[#4B2E83]">
                        ${Number(post.hourlyRate).toFixed(2)}/hr
                      </div>
                      {post.reviews && (
                        <div className="text-sm text-gray-500">
                          ⭐ {post.reviews} reviews
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600 line-clamp-3">{post.bio}</p>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                    <div className="text-sm text-gray-500">
                      Experience: {post.experience || "Not specified"}
                    </div>
                    {deletingPostId === post.id.toString() ? (
                      <Button
                        onClick={() => handleDeletePost(post.id.toString())}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white shrink-0"
                      >
                        Click to Confirm
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleDeleteClick(post.id.toString())}
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                      >
                        Delete Post
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Empty state with call-to-action
        <Card className="p-8 text-center">
          <Inbox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No tutor posts yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first tutor post
          </p>
          <Button
            onClick={() => router.push("/become-a-tutor")}
            className="bg-[#4B2E83] hover:bg-[#4B2E83]/90 text-white"
          >
            Create Tutor Post
          </Button>
        </Card>
      )}

      {/* Messages section */}
      <div className="mt-12">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-[#4B2E83] mb-2">Messages</h2>
          <p className="text-lg text-gray-600">
            Messages from potential students
          </p>
        </div>
        <MessageList />
      </div>
    </div>
  );
}
