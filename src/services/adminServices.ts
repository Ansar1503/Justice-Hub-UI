import { store } from "@/Redux/store";
import axiosinstance from "@/utils/api/axios/axios.instance";

export async function fetchUserByRole(query: any) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/admin/users?role=${query.role || ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function fetchAllLawyers() {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get("/api/admin/lawyers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function blockUser(user_id:string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/admin/user/",
    {user_id},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
