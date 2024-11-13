import { prisma } from "@/lib/prisma";

//Handle creation of message in database
export async function createMessage(
  senderId: number,
  recipientId: number,
  tutorPostId: number,
  message: string
) {
  try {
    const newMessage = await prisma.message.create({
      data: {
        //Connect to user by their ids
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
        tutorPost: { connect: { id: tutorPostId } },
        message, //message content
      },

      //All the related info from response
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

//Query for user's message by id
export async function getUserMessages(userId: number) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        recipientId: userId, //Query for only messages sent to user
      },
      include: {
        //Get sender email
        sender: {
          select: { email: true },
        },
        //Rrecipient email
        recipient: {
          select: { email: true },
        },
        //Get tutor post details
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
        createdAt: "desc", //Sort by newest
      },
    });

    return messages;
  } catch (error) {
    console.error("Error fetching user messages:", error);
    throw error;
  }
}
