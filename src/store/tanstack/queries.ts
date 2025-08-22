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
  fetchReviewDisputes,
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
  fetchClientDataType,
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
import { Review } from "@/types/types/Review";
import { Disputes, FetchChatDisputesResponseDto } from "@/types/types/Disputes";
import {
  fetchCallLogs,
  FetchClientOrLawyerReviews,
} from "@/utils/api/services/commonServices";
import { store } from "../redux/store";
import { FetchLawyerResponseType } from "@/types/types/LawyerTypes";

export function useFetchClientData() {
  const { user } = store.getState().Auth;
  return useQuery<fetchClientDataType, Error>({
    queryKey: ["user", user?.user_id],
    queryFn: fetchClientData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled:
      user && user?.role !== "admin" && user.user_id != null ? true : false,
  });
}

export function useFetchLawyerData() {
  const { user } = store.getState().Auth;
  return useQuery<FetchLawyerResponseType>({
    queryKey: ["lawyer", user?.user_id],
    queryFn: fetchLawyerData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: user && user?.role === "lawyer" ? true : false,
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
    queryKey: ["user", query],
    queryFn: () => fetchUserByRole(query),
    retry: 1,
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
    retry: 1,
  });
}

export function useFetchLawyersByQuery(query: LawyerFilterParams) {
  return useQuery({
    queryKey: ["lawyers", "queries"],
    queryFn: () => fetchLawyersByQuery(query),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useFetchLawyerDetails(user_id: string) {
  return useQuery({
    queryKey: ["lawyer", "details", user_id],
    queryFn: () => fetchLawyerDetails(user_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useFetchSlotSettings() {
  return useQuery<ResponseType & { data: slotSettings }, Error>({
    queryKey: ["schedule", "settings"],
    queryFn: fetchSlotSettings,
    retry: 1,
  });
}

export function useFetchLawyerSlotSettings(lawyer_id: string) {
  return useQuery<ResponseType & { data: slotSettings }, Error>({
    queryKey: ["schedule", "settings", lawyer_id],
    queryFn: () => fetchLawyerSlotSettings(lawyer_id),
    retry: 1,
  });
}

export function useFetchAvailableSlots() {
  return useQuery<ResponseType & { data: Availability }, Error>({
    queryKey: ["schedule", "availability"],
    queryFn: () => fetchAvailableSlots(),
    retry: 1,
  });
}

export function useFetchOverrideSlots() {
  return useQuery<OverrideDateResponse, Error>({
    queryKey: ["schedule", "overrides"],
    queryFn: () => fetchOverrideslots(),
    retry: 1,
  });
}

export function useFetchSlotsforClients(id: string, date: Date) {
  return useQuery({
    queryKey: ["schedule", "slots", id, date],
    queryFn: () => fetchSlotsforClients(id, date),
    retry: 1,
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
    retry: 1,
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
    retry: 1,
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
    retry: 1,
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
    retry: 1,
  });
}

export function useFetchSessionDocuments(sessionId: string) {
  return useQuery<string, Error, SessionDocument>({
    queryKey: ["session", "documents", sessionId],
    queryFn: () => fetchSessionDocuments(sessionId),
    enabled: !!sessionId,
    retry: 1,
  });
}

export function useFetchAppointmentsForAdmin(payload: {
  search: string;
  consultation_type: "consultation" | "follow-up" | "all";
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
      consultation_type: "consultation" | "follow-up" | "all";
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
    retry: 1,
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
    retry: 1,
  });
}

export function useFetchChatDisputes(payload: {
  search: string;
  sortBy: "message_date" | "reported_date";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
}) {
  return useQuery<
    {
      search: string;
      sortBy: "message_date" | "reported_date";
      sortOrder: "asc" | "desc";
      limit: number;
      page: number;
    },
    Error,
    FetchChatDisputesResponseDto
  >({
    queryKey: ["admin", "disputes", "chat", payload],
    queryFn: () => fetchChatDisputes(payload),
    retry: 1,
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
    queryKey: ["reviews", sessionId],
    queryFn: () => fetchReviewsBySession(sessionId),
    enabled: sessionId ? true : false,
    retry: 1,
  });
}

export function useFetchReviewsListClientOrLawyer(payload: {
  search: string;
  limit: number;
  page: number;
  sortBy: "date" | "rating";
  sortOrder: "asc" | "desc";
}) {
  return useQuery<
    {
      search: string;
      limit: number;
      page: number;
      sortBy: "date" | "rating";
      sortOrder: "asc" | "desc";
    },
    Error,
    {
      data: {
        id: string;
        session_id: string;
        heading: string;
        rating: number;
        review: string;
        client_id: string;
        lawyer_id: string;
        reviewedBy: { name: string; profile_image: string };
        reviewedFor: { name: string; profile_image: string };
        createdAt: string;
        updatedAt: string;
      }[];
      totalCount: number;
      currentPage: number;
      totalPage: number;
    }
  >({
    queryKey: ["reviews", payload],
    queryFn: () => FetchClientOrLawyerReviews(payload),
    retry: 1,
  });
}

export function useFetchReviewDisputes(payload: {
  limit: number;
  page: number;
  search: string;
  sortBy: "review_date" | "reported_date" | "All";
  sortOrder: "asc" | "desc";
}) {
  return useQuery<
    {
      limit: number;
      page: number;
      search: string;
      sortBy: "review_date" | "reported_date" | "All";
      sortOrder: "asc" | "desc";
    },
    Error,
    {
      totalCount: number;
      currentPage: number;
      totalPage: number;
      data:
        | ({
            contentData: Review;
            reportedByuserData: userDataType & clientDataType;
            reportedUserData: userDataType & clientDataType;
          } & Disputes)[]
        | [];
    }
  >({
    queryKey: ["admin", "disputes", "review", payload],
    queryFn: () => fetchReviewDisputes(payload),
    retry: 1,
  });
}

export function useFetchCallLogs(payload: {
  sessionId: string;
  limit: number;
  page: number;
}) {
  return useQuery({
    queryKey: ["callLogs", payload],
    queryFn: () => fetchCallLogs(payload),
    retry: 1,
    enabled: payload.sessionId ? true : false,
  });
}
