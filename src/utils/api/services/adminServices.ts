import { store } from "@/store/redux/store";
import axiosinstance from "@/utils/api/axios/axios.instance";

export async function fetchUserByRole(query: {
  role: "lawyer" | "client";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  status: "all" | "verified" | "blocked";
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/admin/users?role=${query.role || ""}&search=${
      query.search || ""
    }&page=${query.page || 1}&limit=${query.limit || 10}&sort=${
      query.sortBy || ""
    }&order=${query.sortOrder || "asc"}&status=${query.status || "all"}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // console.log("response of users from admin : ", response);
  return response.data;
}

export async function fetchAllLawyers(query: {
  sort?: "name" | "experience" | "consultation_fee" | "createdAt";
  order?: "asc" | "desc";
  page: number;
  limit: number;
  status?: "all" | "verified" | "rejected" | "pending" | "requested";
  search: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/admin/lawyers?sort=${query?.sort || "name"}&order=${
      query?.order || "asc"
    }&page=${query?.page || 1}&limit=${query?.limit || 10}&status=${
      query?.status || "all"
    }&search=${query?.search || ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function ChangeBlockStatusUser(user_id: string, status: boolean) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/admin/user/",
    { user_id, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function changeLawyerVerificationStatus({
  user_id,
  status,
  rejectReason,
}: {
  rejectReason?: string;
  user_id: string;
  status: "verified" | "rejected" | "pending" | "requested";
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/admin/lawyer/",
    { user_id, status, rejectReason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchAppointmentsForAdmin(payload: {
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
  const { search, limit, page, sortBy, sortOrder, status, type } = payload;
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/admin/appointments?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${status}&type=${type}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchSessionsForAdmin(payload: {
  search: string;
  type: "consultation" | "follow-up" | "all";
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed" | "all";
  sortBy: "date" | "amount" | "lawyer_name" | "client_name";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
}) {
  const { search, limit, page, sortBy, sortOrder, status, type } = payload;
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/admin/sessions?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${status}&type=${type}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchChatDisputes(payload: {
  search: string;
  sortBy: "All" | "session_date" | "reported_date";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
}) {
  const { search, limit, page, sortBy, sortOrder } = payload;
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/admin/disputes/chat?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function deleteMessage(messageId: string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.delete(
    `/api/admin/disputes/chat/${messageId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchReviewDisputes(payload: {
  limit: number;
  page: number;
  search: string;
  sortBy: "review_date" | "reported_date" | "All";
  sortOrder: "asc" | "desc";
}) {
  const { search, limit, page, sortBy, sortOrder } = payload;
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/admin/disputes/reviews?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function deleteDisputeReview(payload: {
  reviewId: string;
  diputeId: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.delete(
    `/api/admin/disputes/reviews/${payload.reviewId}/${payload.diputeId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
