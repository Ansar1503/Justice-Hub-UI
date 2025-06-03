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

export async function blockUser(user_id: string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/admin/user/",
    { user_id },
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
}: {
  user_id: string;
  status: "verified" | "rejected" | "pending" | "requested";
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/admin/lawyer/",
    { user_id, status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
