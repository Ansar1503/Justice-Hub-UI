import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { CallLogs } from "@/types/types/callLogs";
import {
  AppointmentStatus,
  AppointmentType,
} from "@/components/Lawyer/appointmentsListing";
import { SortOrder } from "@/components/users/AppointmentsComponent";
import { FetchSessionsPayloadType } from "@/types/types/sessionType";
import {
  CommonQueies,
  SpecializationRoutes,
} from "@/utils/constants/RouteConstants";
import { FetchSpecializationRequestPayloadType } from "@/types/types/SpecializationType";

export async function joinVideoSession(payload: { sessionId: string }) {
  const { user } = store.getState().Auth;
  const role = user?.role;
  const result = await axiosinstance.patch(
    `/api/${role}/profile/sessions/join`,
    {
      sessionId: payload.sessionId,
    }
  );
  return result.data;
}

export async function fetchCallLogs(payload: {
  sessionId: string;
  limit: number;
  page: number;
}): Promise<{
  data: CallLogs[] | [];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const { user } = store.getState().Auth;
  const role = user?.role;
  const result = await axiosinstance.get(
    `/api/${role}/profile/sessions/callLogs/${payload.sessionId}?limit=${payload.limit}&page=${payload.page}`
  );
  return result.data;
}

export async function FetchClientOrLawyerReviews(payload: {
  search: string;
  limit: number;
  page: number;
  sortBy: "date" | "rating";
  sortOrder: "asc" | "desc";
}) {
  const { limit, page, search, sortBy, sortOrder } = payload;
  const { user } = store.getState().Auth;
  if (!user) return;
  const response = await axiosinstance.get(
    `api/${user.role}/profile/reviews/?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
  return response.data;
}

export async function fetchAppointments(payload: {
  search?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  sortField: string;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  // console.log("payload", payload);
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/${user?.role}/profile/appointments?search=${payload.search}&appointmentStatus=${payload.appointmentStatus}&consultationType=${payload.appointmentType}&sortBy=${payload.sortField}&sortOrder=${payload.sortOrder}&page=${payload.page}&limit=${payload.limit}`
  );
  return response.data;
}

export async function fetchSessions(payload: FetchSessionsPayloadType) {
  const { search, limit, page, sortBy, sortOrder, status, type } = payload;
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/${user?.role}/profile/sessions?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${status}&consultation_type=${type}`
  );
  return response.data;
}

export async function updateNotificationStatus(payload: {
  id: string;
  status: boolean;
}) {
  const { user } = store.getState().Auth;
  const { id, status } = payload;
  const response = await axiosinstance.patch(
    `/api/${user?.role}/notification/${id}/status`,
    { status }
  );
  return response.data;
}

export async function MarkAllNotificationsAsRead() {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.put(
    `/api/${user?.role}/notification/status`
  );
  return response.data;
}

export async function fetchReviews(pageParam: any, lawyer_id: string) {
  // console.log("lawyerId", lawyer_id, "cursort", pageParam);
  const response = await axiosinstance.get(
    `/api/client/lawyers/reviews/${lawyer_id}?cursor=${pageParam}`
  );
  return response.data;
}

export async function fetchAllNotifications(pageParam: any) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/${user?.role}/notifications?cursor=${pageParam}`
  );
  return response.data;
}

export async function fetchAllSpecializations(
  payload: FetchSpecializationRequestPayloadType
) {
  const { user } = store.getState().Auth;
  const { limit, page, search } = payload;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      SpecializationRoutes.base +
      CommonQueies.pageQuery +
      page +
      CommonQueies.limitQuery +
      limit +
      CommonQueies.searchQuery +
      search
  );
  return response.data;
}
