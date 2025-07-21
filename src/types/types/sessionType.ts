export interface SessionDocument {
  _id: string;
  session_id: string;
  client_id: string;
  document: { name: string; type: string; url: string; _id?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  _id?: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  duration: number;
  reason: string;
  amount: number;
  type: "consultation" | "follow-up";
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";
  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
