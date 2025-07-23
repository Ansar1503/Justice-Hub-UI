export interface NotificationType {
  _id?: string;
  recipientId: string;
  senderId: string;
  type: "message" | "session";
  title: string;
  roomId?: string;
  sessionId?: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}
