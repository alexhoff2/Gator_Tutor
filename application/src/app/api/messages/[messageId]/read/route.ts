import { markMessageAsRead } from "@/lib/services/messages";
import { getSession } from "@/lib/utils/auth";

/**
 * Message Read Status Route 📫 → 📭
 * 
 * Handles POST /api/messages/[messageId]/read
 * Updates a message's status from unread to read
 * 
 * The flow:
 * 1. Check if user is logged in
 * 2. Mark the message as read
 * 3. Return the updated message
 * 
 * !IMPORTANT: We don't check if the user owns the message
 * TODO: Add permission check before marking as read
 */
export async function POST(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    // First, make sure someone's logged in
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }  // 401 = Not logged in
      );
    }

    // Convert the URL parameter to a number
    // messageId comes from the [messageId] folder name
    const messageId = parseInt(params.messageId);

    // Ask the messages service to update the read status
    const updatedMessage = await markMessageAsRead(messageId);

    // All good! Send back the updated message
    return Response.json({ success: true, data: updatedMessage });
  } catch (error) {
    // Something went wrong - log it but keep details private
    console.error("Error marking message as read:", error);
    return Response.json(
      { success: false, message: "Failed to mark message as read" },
      { status: 500 }  // 500 = Server error
    );
  }
}
