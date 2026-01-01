export interface CallLogs {
  _id?: string;
  roomId: string;
  session_id: string;
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  client_left_at?: Date;
  lawyer_joined_at?: Date;
  lawyer_left_at?: Date;
  callDuration?: number;
  status: "ongoing" | "completed" | "cancelled" | "missed" | "dropped";
  createdAt?: Date;
  updatedAt?: Date;
}
