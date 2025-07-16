import {
  fetchAppointmentsForClient,
  fetchClientData,
  fetchLawyerDetails,
  fetchLawyersByQuery,
  fetchLawyerSlotSettings,
  fetchReviewsBySession,
  fetchSessionDocuments,
  fetchSessionsforClients,
  fetchSlotsforClients,
} from "@/utils/api/services/clientServices";
import {
  fetchAllLawyers,
  fetchAppointmentsForAdmin,
  fetchChatDisputes,
  fetchSessionsForAdmin,
  fetchUserByRole,
} from "@/utils/api/services/adminServices";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAppointmentsForLawyers,
  fetchAvailableSlots,
  fetchLawyerData,
  fetchOverrideslots,
  fetchSessionsforLawyers,
  fetchSlotSettings,
} from "@/utils/api/services/LawyerServices";
import {
  clientDataType,
  LawyerFilterParams,
  userDataType,
} from "@/types/types/Client.data.type";
import {
  Availability,
  OverrideDateResponse,
  slotSettings,
} from "@/types/types/SlotTypes";
import {
  AppointmentStatus,
  AppointmentType,
  SortField,
  SortOrder,
} from "@/components/users/AppointmentsComponent";
import { ResponseType } from "@/types/types/LoginResponseTypes";
import { Session, SessionDocument } from "@/types/types/sessionType";
import { Appointment } from "@/types/types/AppointmentsType";
import { ChatMessage, ChatSession } from "@/types/types/ChatType";
import { Review } from "@/types/types/Review";

export function useFetchClientData() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchClientData,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchLawyerData() {
  return useQuery({
    queryKey: ["lawyer"],
    queryFn: fetchLawyerData,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchUsersByRole(query: {
  role: "lawyer" | "client";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  status: "all" | "verified" | "blocked";
}) {
  return useQuery({
    queryKey: ["user", query.role],
    queryFn: () => fetchUserByRole(query),
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}

export function useFetchAllLawyers(query: {
  sort?: "name" | "experience" | "consultation_fee" | "createdAt";
  order?: "asc" | "desc";
  page: number;
  limit: number;
  status?: "all" | "verified" | "rejected" | "pending" | "requested";
  search: string;
}) {
  return useQuery({
    queryKey: ["lawyers"],
    queryFn: () => fetchAllLawyers(query),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchLawyersByQuery(query: LawyerFilterParams) {
  return useQuery({
    queryKey: ["lawyers", "queries"],
    queryFn: () => fetchLawyersByQuery(query),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchLawyerDetails(user_id: string) {
  return useQuery({
    queryKey: ["lawyer", "details", user_id],
    queryFn: () => fetchLawyerDetails(user_id),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchSlotSettings() {
  return useQuery<ResponseType & { data: slotSettings }, Error>({
    queryKey: ["schedule", "settings"],
    queryFn: fetchSlotSettings,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchLawyerSlotSettings(lawyer_id: string) {
  return useQuery<ResponseType & { data: slotSettings }, Error>({
    queryKey: ["schedule", "settings", lawyer_id],
    queryFn: () => fetchLawyerSlotSettings(lawyer_id),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchAvailableSlots() {
  return useQuery<ResponseType & { data: Availability }, Error>({
    queryKey: ["schedule", "availability"],
    queryFn: () => fetchAvailableSlots(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchOverrideSlots() {
  return useQuery<ResponseType & { data: OverrideDateResponse }, Error>({
    queryKey: ["schedule", "overrides"],
    queryFn: () => fetchOverrideslots(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchSlotsforClients(id: string, date: Date) {
  return useQuery({
    queryKey: ["schedule", "slots", id, date],
    queryFn: () => fetchSlotsforClients(id, date),
    staleTime: 1000 * 60 * 10,
    enabled: id !== "" && !date,
  });
}

export function useFetchAppointmentsForClients(payload: {
  search?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["client", "appointments"],
    queryFn: () => fetchAppointmentsForClient(payload),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchAppointmentsForLawyers(payload: {
  search?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  sortField: string;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["lawyer", "appointments"],
    queryFn: () => fetchAppointmentsForLawyers(payload),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchSessionsForLawyers(payload: {
  search: string;
  status: string;
  sort: string;
  order: "asc" | "desc";
  consultation_type: string;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["lawyer", "sessions"],
    queryFn: () => fetchSessionsforLawyers(payload),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchsessionsForclients(payload: {
  search: string;
  status: string;
  sort: string;
  order: "asc" | "desc";
  consultation_type: string;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["client", "sessions"],
    queryFn: () => fetchSessionsforClients(payload),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchSessionDocuments(sessionId: string) {
  return useQuery<string, Error, ResponseType & { data: SessionDocument }>({
    queryKey: ["session", "documents", sessionId],
    queryFn: () => fetchSessionDocuments(sessionId),
    staleTime: 1000 * 60 * 10,
    enabled: !!sessionId,
  });
}

export function useFetchAppointmentsForAdmin(payload: {
  search: string;
  type: "consultation" | "follow-up" | "all";
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "rejected"
    | "all";
  sortBy: "date" | "amount" | "lawyer_name" | "client_name";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
}) {
  return useQuery<
    {
      search: string;
      type: "consultation" | "follow-up" | "all";
      status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "rejected"
        | "all";
      sortBy: "date" | "amount" | "lawyer_name" | "client_name";
      sortOrder: "asc" | "desc";
      limit: number;
      page: number;
    },
    Error,
    {
      data:
        | (Appointment & {
            clientData: userDataType & clientDataType;
            lawyerData: userDataType & clientDataType;
          })[]
        | [];

      totalCount: number;
      currentPage: number;
      totalPage: number;
    }
  >({
    queryKey: ["admin", "appointments", payload],
    queryFn: () => fetchAppointmentsForAdmin(payload),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchSessionsForAdmin(payload: {
  search: string;
  type: "consultation" | "follow-up" | "all";
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed" | "all";
  sortBy: "date" | "amount" | "lawyer_name" | "client_name";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
}) {
  return useQuery<
    {
      search: string;
      type: "consultation" | "follow-up" | "all";
      status:
        | "upcoming"
        | "ongoing"
        | "completed"
        | "cancelled"
        | "missed"
        | "all";
      sortBy: "date" | "amount" | "lawyer_name" | "client_name";
      sortOrder: "asc" | "desc";
      limit: number;
      page: number;
    },
    Error,
    {
      data:
        | (Session & {
            clientData: userDataType & clientDataType;
            lawyerData: userDataType & clientDataType;
          })[]
        | [];

      totalCount: number;
      currentPage: number;
      totalPage: number;
    }
  >({
    queryKey: ["admin", "sessions", payload],
    queryFn: () => fetchSessionsForAdmin(payload),
    // staleTime: 1000 * 60 * 10,
  });
}

export function useFetchChatDisputes(payload: {
  search: string;
  sortBy: "All" | "session_date" | "reported_date";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
}) {
  return useQuery<
    {
      search: string;
      sortBy: "All" | "session_date" | "reported_date";
      sortOrder: "asc" | "desc";
      limit: number;
      page: number;
    },
    Error,
    {
      totalCount: number;
      currentPage: number;
      totalPage: number;
      data:
        | ({
            chatSession: ChatSession & {
              clientData: userDataType & clientDataType;
              lawyerData: userDataType & clientDataType;
            };
          } & ChatMessage)[]
        | [];
    }
  >({
    queryKey: ["admin", "disputes", "chat", payload],
    queryFn: () => fetchChatDisputes(payload),
    // staleTime: 1000 * 60 * 10,
  });
}

export function useFetchReviewsBySession(sessionId: string) {
  return useQuery<
    string,
    Error,
    {
      reviewedBy?: {
        name?: string | null;
        profile_image?: string | null;
      };
    } & Review[]
  >({
    queryKey: ["client", "reviews", sessionId],
    queryFn: () => fetchReviewsBySession(sessionId),
  });
}
