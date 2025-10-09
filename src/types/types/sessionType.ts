import { Appointment } from "./AppointmentsType";
import { UserProfile } from "./Usertypes";

export interface SessionDocument {
  _id: string;
  session_id: string;
  client_id: string;
  caseId: string;
  document: { name: string; type: string; url: string; _id?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id?: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  caseId: string;
  bookingId: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";

  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  room_id?: string;
  start_time?: string;
  end_time?: string;
  client_joined_at?: Date;
  client_left_at?: Date;
  lawyer_joined_at?: Date;
  lawyer_left_at?: Date;
  end_reason?: string;
  callDuration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseSession {
  id: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  caseId: string;
  bookingId: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";

  notes?: string;
  summary?: string;
  room_id?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  client_left_at?: Date;
  lawyer_joined_at?: Date;
  lawyer_left_at?: Date;
  end_reason?: string;
  callDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionDataType extends BaseSession {
  clientData: UserProfile;
  lawyerData: UserProfile;
  appointmentDetails: Appointment;
}
export interface FetchSessionsResponse {
  data: SessionDataType[] | [];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}

export interface FetchSessionsPayloadType {
  search?: string;
  limit: number;
  page: number;
  sortBy?: "date" | "amount" | "lawyer_name" | "client_name";
  sortOrder?: "asc" | "desc";
  status?:
    | "upcoming"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "missed"
    | "all";
  type?: "consultation" | "follow-up" | "all";
}
