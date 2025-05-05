import { store } from "@/store/redux/store";
import axiosinstance from "@/utils/api/axios/axios.instance";

export async function LawyerVerification(formData: any) {
  // console.log("formdata", formData);
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    "/api/lawyer/verification",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function fetchLawyerData() {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get("/api/lawyer/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function addBlockedDates(payload: {
  date: string;
  reason: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    "/api/lawyer/schedule/block",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchBlockedDates() {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get("/api/lawyer/schedule/block", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function removeBlockedDate(payload: { id: string }) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.delete(
    `/api/lawyer/schedule/block/${payload.id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}
