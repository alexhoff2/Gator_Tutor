import { markMessageAsRead } from "@/lib/services/messages";
import { getSession } from "@/lib/utils/auth";

export async function POST(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    //Check if logged in
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    //Convert the URL parameter to number
    const messageId = parseInt(params.messageId);

    const updatedMessage = await markMessageAsRead(messageId);

    return Response.json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return Response.json(
      { success: false, message: "Failed to mark message as read" },
      { status: 500 } //Server error
    );
  }
}
