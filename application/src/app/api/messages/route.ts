import { getUserMessages, createMessage } from "@/lib/services/messages";
import { getSession } from "@/lib/utils/auth";

/**
 * Messages Route 💌
 *
 * Handles two operations:
 * GET  /api/messages    - Fetch all messages for current user
 * POST /api/messages    - Send a new message
 *
 * Think of this as a mailbox:
 * - GET opens the mailbox and shows what's inside
 * - POST drops a new letter in someone else's box
 *
 * !IMPORTANT: Both operations require authentication
 */

// Fetch messages for the current user
export async function GET() {
  try {
    // Check if user has a valid session
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 } // No peeking in others' mailboxes!
      );
    }

    // Grab all messages where they're the recipient
    const messages = await getUserMessages(parseInt(session.userId as string));
    return Response.json({ success: true, data: messages });
  } catch (error) {
    // Log the real error but keep it vague for the user
    console.error("Error fetching messages:", error);
    return Response.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(request: Request) {
  try {
    // Verify sender's identity
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 } // Must be logged in to send messages
      );
    }

    // Extract message details from request body
    const { recipientId, tutorPostId, message } = await request.json();

    // Hand off to the messages service for delivery
    const newMessage = await createMessage(
      parseInt(session.userId as string), // From: current user
      recipientId, // To: recipient
      tutorPostId, // About: specific tutor post
      message // Content: the actual message
    );

    return Response.json({ success: true, data: newMessage });
  } catch (error) {
    // Log the real error but keep it vague for the user
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
