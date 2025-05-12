import { store } from "@/store/redux/store";
import { dayType, reccuringType, slotSettings } from "@/types/types/SlotTypes";
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
  // console.log("payload", payload);
  // return
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

export async function addReccuringSlot(day: dayType) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    "/api/lawyer/schedule/recurring",
    { day },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchAllRecurringSlot() {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get("/api/lawyer/schedule/recurring", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function removeRecurringSlot(day: dayType) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.delete(
    `/api/lawyer/schedule/recurring/${day}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function updateRecurringSlot(payload: {
  day: dayType;
  key: keyof Omit<reccuringType, "_id" | "day">;
  value: string | boolean;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/lawyer/schedule/recurring`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
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

export async function addAvailableTimeSlot(payload: { date: Date }) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    `/api/lawyer/scheule/availableslot`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchAvailableSlots(date: Date | undefined) {
  if (!date) return;
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/lawyer/schedule/availableslot?date=${date}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function removeOneAvailableSlot(payload: {
  date: Date;
  startTime: string;
  endTime: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/lawyer/schedule/availableslot/d",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function updateAvailableSlot(payload: {
  prev: { date: Date; startTime: string; endTime: string };
  update: { key: "startTime" | "endTime"; value: string };
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/lawyer/schedule/availableslot`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchAvailableSlotsByWeek(week: Date) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/lawyer/schedule/availableslot/week/${week}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
