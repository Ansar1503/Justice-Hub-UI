import { store } from "@/store/redux/store";
import { Availability, slotSettings } from "@/types/types/SlotTypes";
import axiosinstance from "@/utils/api/axios/axios.instance";

export async function LawyerVerification(formData: any) {
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

export async function updateScheduleSettings(payload: slotSettings) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/lawyer/schedule/settings`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchSlotSettings() {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(`/api/lawyer/schedule/settings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateAvailableSlots(payload: Availability) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/lawyer/schedule/availability`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchAvailableSlots(){
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/lawyer/schedule/availability`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}