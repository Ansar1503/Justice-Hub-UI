import {
  FetchAllPayments,
  FetchClientDashboardData,
  fetchClientData,
  fetchLawyerDetails,
  fetchLawyersByQuery,
  fetchLawyerSlotSettings,
  fetchProfileImage,
  fetchReviewsBySession,
  fetchSessionDocuments,
  fetchSlotsforClients,
} from "@/utils/api/services/clientServices";
import {
  fetchAllLawyers,
  fetchChatDisputes,
  fetchReviewDisputes,
  fetchUserByRole,
} from "@/utils/api/services/adminServices";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAvailableSlots,
  fetchLawyerDashboarData,
  fetchLawyerData,
  fetchOverrideslots,
  fetchSlotSettings,
} from "@/utils/api/services/LawyerServices";
import {
  ClientDashboardDataType,
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
  SortOrder,
} from "@/components/users/AppointmentsComponent";
import { ResponseType } from "@/types/types/LoginResponseTypes";
import {
  FetchSessionsPayloadType,
  FetchSessionsResponse,
  SessionDocument,
} from "@/types/types/sessionType";
import { FetchAppointmentsOutputDto } from "@/types/types/AppointmentsType";
import { Review } from "@/types/types/Review";
import { Disputes, FetchChatDisputesResponseDto } from "@/types/types/Disputes";
import {
  fetchAppointments,
  fetchCallLogs,
  FetchClientOrLawyerReviews,
  fetchSessions,
} from "@/utils/api/services/commonServices";
import { store } from "../redux/store";
import {
  AggregatedLawyerResponseAdminSide,
  FetchLawyerResponseType,
  FrontendLawyerDashboard,
} from "@/types/types/LawyerTypes";
import { FrontendAdminDashboard } from "@/types/types/AdminDashboardType";
import axiosinstance from "@/utils/api/axios/axios.instance";
import {
  PaymentBaseType,
  PaymentfetchPayload,
} from "@/types/types/PaymentType";

export function useFetchClientData() {
  const { user } = store.getState().Auth;
  return useQuery<fetchClientDataType, Error>({
    queryKey: ["user", user?.user_id],
    queryFn: fetchClientData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
    retry: 0,
    enabled:
      user && user?.role !== "admin" && user.user_id != null ? true : false,
  });
}

export function useFetchProfileImage() {
  return useQuery<string>({
    queryKey: ["profileImage"],
    queryFn: fetchProfileImage,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
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
    enabled:
      (user && user?.role === "lawyer") ||
      user?.lawyer_verification_status === "verified"
        ? true
        : false,
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
  return useQuery<AggregatedLawyerResponseAdminSide>({
    queryKey: ["lawyers"],
    queryFn: () => fetchAllLawyers(query),
    retry: 1,
  });
}

export function useFetchLawyersByQuery(query: LawyerFilterParams) {
  return useQuery({
    queryKey: ["lawyers", "queries", query],
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
    enabled: Boolean(id && date),
  });
}

export function useFetchAppointments(payload: {
  search?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  sortField: string;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  return useQuery<FetchAppointmentsOutputDto>({
    queryKey: ["appointments", payload],
    queryFn: () => fetchAppointments(payload),
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

export function useFetchSessions(payload: FetchSessionsPayloadType) {
  return useQuery<FetchSessionsPayloadType, Error, FetchSessionsResponse>({
    queryKey: ["sessions", payload],
    queryFn: () => fetchSessions(payload),
    staleTime: 1000 * 60 * 10,
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

export function useFetchClientDashboardData() {
  const { user } = store.getState().Auth;
  return useQuery<ClientDashboardDataType>({
    queryKey: ["client", "dashboard", user?.user_id],
    queryFn: () => FetchClientDashboardData(),
    retry: 1,
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(user?.user_id),
  });
}

export function useFetchLawyerDashboardData() {
  const { user } = store.getState().Auth;
  return useQuery<FrontendLawyerDashboard>({
    queryKey: ["client", "dashboard", user?.user_id],
    queryFn: () => fetchLawyerDashboarData(),
    retry: 1,
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(user?.user_id),
  });
}

export function useAdminDashboard(startDate?: string, endDate?: string) {
  return useQuery<FrontendAdminDashboard>({
    queryKey: ["admin", "dashboard", { startDate, endDate }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      const res = await axiosinstance(
        `/api/admin/dashboard/overview?${params.toString()}`
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useFetchAllPayments(payload: PaymentfetchPayload) {
  return useQuery<{
    data: PaymentBaseType[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>({
    queryKey: ["client", "payments", payload],
    queryFn: () => FetchAllPayments(payload),
    retry: 1,
    enabled: payload?.page ? true : false,
    staleTime: 1000 * 60 * 5,
  });
}
