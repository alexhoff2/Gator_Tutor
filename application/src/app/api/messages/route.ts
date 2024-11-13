import { getUserMessages, createMessage } from "@/lib/services/messages";
import { getSession } from "@/lib/utils/auth";

//Fetch current user messages
export async function GET() {
  try {
    //Check if valid session
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    //Query for all messages where user is the recipient
    const messages = await getUserMessages(parseInt(session.userId as string));
    return Response.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);

    return Response.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

//Send new message
export async function POST(request: Request) {
  try {
    //Verify identity
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 } //User not logged in
      );
    }

    //Get message detail from reponse
    const { recipientId, tutorPostId, message } = await request.json();

    //Handled by message service
    const newMessage = await createMessage(
      parseInt(session.userId as string), //Current user
      recipientId, //Recipient
      tutorPostId, //Tutor post
      message //Actual message
    );

    return Response.json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);

    return Response.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
