import {
  clientDataType,
  LawerDataType,
  userDataType,
} from "./Client.data.type";
import { Session } from "./sessionType";

export interface ChatSession {
  _id?: string;
  name: string;
  participants: { lawyer_id: string; client_id: string };
  last_message: string;
  session_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  id?: string;
  session_id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  report?: {
    reason: string;
    reportedAt: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AggregateChatSession extends ChatSession {
  clientData: userDataType & clientDataType;
  lawyerData: userDataType & clientDataType & LawerDataType;
  sessionDetails: Session;
  lastMessage: ChatMessage;
}
