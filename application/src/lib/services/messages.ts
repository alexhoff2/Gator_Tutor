import { prisma } from "@/lib/prisma";

/**
 * Messages Service
 *
 * Handles all the database operations for messages between students and tutors.
 * Think of it as the post office for our app - it handles sending, receiving,
 * and tracking messages.
 *
 * What's in the box:
 * -----------------
 * - getUserMessages: Fetch all messages for a user
 * - markMessageAsRead: Mark a message as read
 * - createMessage: Send a new message
 */

/**
 * Get all messages for a user
 *
 * This is a pretty hefty query that grabs:
 * - Basic message info
 * - Sender's email
 * - Recipient's email
 * - Related tutor post details
 * - Subject info from the tutor post
 *
 * Orders messages newest first
 *
 */

// TODO: Encrypt the message contents?
// TODO: Add pagination?

export async function getUserMessages(userId: number) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        recipientId: userId, // Only get messages sent TO this user
      },
      include: {
        // Grab sender info (just email for now)
        // TODO: Consider adding name/profile pic/etc, maybe a full user object?, or have a separate query for that idk
        sender: {
          select: { email: true },
        },
        // Same for recipient
        recipient: {
          select: { email: true },
        },
        // Get the related tutor post details
        tutorPost: {
          select: {
            id: true,
            hourlyRate: true,
            tutorSubjects: {
              select: { subject: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest first
        // TODO: Consider adding readAt ordering? or some dynamic ordering based on the user's preferences?
      },
    });

    return messages;
  } catch (error) {
    console.error("Error fetching user messages:", error);
    throw error;
  }
}

/**
 * Mark a message as read
 *
 * Super simple - just updates the readAt timestamp
 * Used when a user opens/views a message
 */
export async function markMessageAsRead(messageId: number) {
  try {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
    return message;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
}

/**
 * Create a new message
 *
 * Takes:
 * - senderId: Who's sending it
 * - recipientId: Who's getting it
 * - tutorPostId: Which tutor post it's about
 * - message: The actual message text
 *
 * Returns the new message with all the related info
 * (same structure as getUserMessages)
 */
export async function createMessage(
  senderId: number,
  recipientId: number,
  tutorPostId: number,
  message: string
) {
  try {
    const newMessage = await prisma.message.create({
      data: {
        // Connect existing records using their IDs
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
        tutorPost: { connect: { id: tutorPostId } },
        message, // The actual message text
      },
      // Include all the related info in the response
      include: {
        sender: {
          select: { email: true },
        },
        recipient: {
          select: { email: true },
        },
        tutorPost: {
          select: {
            id: true,
            hourlyRate: true,
            tutorSubjects: {
              select: { subject: true },
            },
          },
        },
      },
    });

    return newMessage;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}
