import type { User } from "@prisma/client";

//Shape of message data
export interface Message {
  //Core message
  id: number;
  message: string;
  createdAt: Date;
  readAt: Date | null; // null means unread

  // Relationship IDs
  senderId: number;
  recipientId: number;
  tutorPostId: number; // Which tutor post it's about

  //User Emails
  sender: {
    email: string;
  };
  recipient: {
    email: string;
  };

  //Tutor post data
  tutorPost: {
    id: number;
    hourlyRate: number;
    tutorSubjects: {
      subject: {
        id: number;
        subjectName: string;
      };
    }[];
  };
}

//API response
export interface MessageResponse {
  success: boolean;
  message?: string; //error success messages
  data?: Message[]; //actual message content
}
