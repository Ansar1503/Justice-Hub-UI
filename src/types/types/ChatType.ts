import {
  clientDataType,
  LawerDataType,
  userDataType,
} from "./Client.data.type";
import { Session } from "./sessionType";

export interface ChatSession {
  _id?: string;
  appointment_id: string;
  participants: {
    lawyer_id: string;
    client_id: string;
  };
  last_message?: string;
  name: string;
  // status: "active" | "closed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  _id?: string;
  session_id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  attachments?: {
    url: string;
    type: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AggregateChatSession extends ChatSession {
  clientData: userDataType & clientDataType;
  lawyerData: userDataType & clientDataType & LawerDataType;
  sessionDetails: Session;
  lastMessage: ChatMessage;
}
