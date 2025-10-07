import { store } from "@/store/redux/store";
import { Disputes } from "@/types/types/Disputes";
import axiosinstance from "@/utils/api/axios/axios.instance";
import {
  CommissionRoutes,
  CommonQueies,
  SpecializationRoutes,
} from "@/utils/constants/RouteConstants";

export async function fetchUserByRole(query: {
  role: "lawyer" | "client";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  status: "all" | "verified" | "blocked";
}) {
  const response = await axiosinstance.get(
    `/api/admin/users?role=${query.role || ""}&search=${
      query.search || ""
    }&page=${query.page || 1}&limit=${query.limit || 10}&sort=${
      query.sortBy || ""
    }&order=${query.sortOrder || "asc"}&status=${query.status || "all"}`
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
  const response = await axiosinstance.get(
    `/api/admin/lawyers?sort=${query?.sort || "name"}&order=${
      query?.order || "asc"
    }&page=${query?.page || 1}&limit=${query?.limit || 10}&status=${
      query?.status || "all"
    }&search=${query?.search || ""}`
  );

  return response.data;
}

export async function ChangeBlockStatusUser(user_id: string, status: boolean) {
  const response = await axiosinstance.patch("/api/admin/user/", {
    user_id,
    status,
  });
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
  const response = await axiosinstance.patch("/api/admin/lawyer/", {
    user_id,
    status,
    rejectReason,
  });
  return response.data;
}

export async function fetchAppointmentsForAdmin(payload: {
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
  const { search, limit, page, sortBy, sortOrder, status, consultation_type } =
    payload;
  const response = await axiosinstance.get(
    `/api/admin/appointments?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${status}&consultation_type=${consultation_type}`
  );
  return response.data;
}

export async function fetchChatDisputes(payload: {
  search: string;
  sortBy: "message_date" | "reported_date";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
}) {
  const { search, limit, page, sortBy, sortOrder } = payload;
  const response = await axiosinstance.get(
    `/api/admin/disputes/chat?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
  return response.data;
}

export async function deleteMessage(messageId: string) {
  const response = await axiosinstance.delete(
    `/api/admin/disputes/chat/${messageId}`
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
  const response = await axiosinstance.get(
    `/api/admin/disputes/reviews?search=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
  return response.data;
}

// export async function deleteDisputeReview(payload: {
//   reviewId: string;
//   diputeId: string;
// }) {
//
//   const response = await axiosinstance.patch(
//     `/api/admin/disputes/reviews/`,
//     payload,
//   );
//   return response.data;
// }

export async function updateDisputesStatus(payload: {
  action?: Disputes["resolveAction"];
  status: Disputes["status"];
  disputesId: string;
}) {
  const response = await axiosinstance.put(
    `/api/admin/disputes/status/${payload.disputesId}`,
    payload
  );
  return response.data;
}

export async function AddorUpdateSpecialization(
  name: string,
  id: string | null
) {
  const payload = { id, name };
  const { user } = store.getState().Auth;
  const response = await axiosinstance.patch(
    CommonQueies.api + user?.role + SpecializationRoutes.base,
    payload
  );
  return response.data;
}

export async function DeleteSpecialization(id: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.delete(
    CommonQueies.api +
      user?.role +
      SpecializationRoutes.base +
      CommonQueies.params +
      id
  );
  return response.data;
}

export async function AddCommissionSettings(payload: {
  id?: string;
  initialCommission: number;
  followupCommission: number;
}) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api +
      user?.role +
      CommissionRoutes.base +
      CommissionRoutes.settings,
    payload
  );
  return response.data;
}
