export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  user_id: string;
  profile_image: string;
  dob: string;
  gender: string;
}

export type Appointment = {
  id: string;
  lawyer_id: string;
  client_id: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  amount: number;
  payment_status: "pending" | "success" | "failed";
  type: "consultation" | "follow-up";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  createdAt?: Date;
  updateAt?: Date;
};

export interface appointmentOutputDto extends Appointment {
  clientData: UserProfile;
  lawyerData: UserProfile;
}

export interface FetchAppointmentsOutputDto {
  data: appointmentOutputDto[];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}
