"use client";

import { useMessages } from "@/lib/hooks/useMessages";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns"; // Converts dates to "2 hours ago" format
import { Icons } from "@/components/ui/icons";

/**
 * Message List Component
 *
 * Displays a list of messages received by the tutor with:
 * - Read/unread status
 * - Timestamp formatting
 * - Sender information
 * - Message content
 * - Related tutor post details
 */
export function MessageList() {
  // Custom hook that handles message fetching and state management
  const { messages, loading, error, setMessages } = useMessages();

  // Show loading spinner while fetching messages
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Icons.spinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Show error state if message fetching failed
  if (error) {
    return (
      <Card className="p-4 text-center text-red-500">
        Failed to load messages
      </Card>
    );
  }

  // Show empty state if no messages exist
  if (!messages.length) {
    return (
      <Card className="p-4 text-center text-gray-500">
        No messages received yet
      </Card>
    );
  }

  /**
   * Handles marking a message as read when opened
   *
   * Logic flow:
   * 1. Check if message is already read (avoid unnecessary API calls)
   * 2. Send POST request to mark as read
   * 3. Update local state optimistically if request succeeds
   *
   * @param messageId - The ID of the message to mark as read
   */
  const handleMessageOpen = async (messageId: number) => {
    // Only proceed if message isn't already read
    if (!messages.find((m) => m.id === messageId)?.readAt) {
      try {
        const response = await fetch(`/api/messages/${messageId}/read`, {
          method: "POST",
        });

        if (response.ok) {
          // Update the message's readAt timestamp in local state
          // This provides immediate feedback without waiting for a page refresh
          setMessages(
            messages.map((msg) =>
              msg.id === messageId ? { ...msg, readAt: new Date() } : msg
            )
          );
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card
          key={message.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleMessageOpen(message.id)}
        >
          <div className="flex gap-4">
            {/* Sender's avatar with fallback to first letter of email */}
            <Avatar className="w-12 h-12">
              <AvatarImage
                src="/images/blank-pfp.png"
                alt={message.sender.email}
              />
              <AvatarFallback>
                {message.sender.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {/* Message header with sender info and timestamp */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{message.sender.email}</h4>
                  <p className="text-sm text-gray-500">
                    {/* Converts timestamp to "2 hours ago" format */}
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {/* Show "New" badge for unread messages */}
                {!message.readAt && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>

              {/* Message content */}
              <p className="mt-2 text-gray-700">{message.message}</p>

              {/* Related tutor post details */}
              <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                <p>
                  Regarding tutor post for:{" "}
                  {/* Join multiple subjects with commas */}
                  {message.tutorPost.tutorSubjects
                    .map((ts) => ts.subject.subjectName)
                    .join(", ")}
                </p>
                <p>
                  {/* Format hourly rate to 2 decimal places */}
                  Rate: ${Number(message.tutorPost.hourlyRate).toFixed(2)}/hr
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
