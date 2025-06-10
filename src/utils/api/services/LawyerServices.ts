import {
  AppointmentStatus,
  AppointmentType,
  SortField,
  SortOrder,
} from "@/components/users/AppointmentsComponent";
import { store } from "@/store/redux/store";
import {
  Availability,
  OverrideDate,
  slotSettings,
} from "@/types/types/SlotTypes";
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

export async function fetchAvailableSlots() {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/lawyer/schedule/availability`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function addOverrideSlots(payload: OverrideDate[]) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    `/api/lawyer/schedule/override`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function fetchOverrideslots() {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(`/api/lawyer/schedule/override`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function removeOverrideSlot(overrideId: string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.delete(
    `/api/lawyer/schedule/override/${overrideId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function fetchAppointmentsForLawyers(payload: {
  search?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  // console.log("payload", payload);
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/lawyer/profile/appointments?search=${payload.search}&appointmentStatus=${payload.appointmentStatus}&appointmentType=${payload.appointmentType}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&page=${payload.page}&limit=${payload.limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function rejectClientAppointment(payload: {
  id: string;
  status: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/lawyer/profile/appointments/reject",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function confirmAppointment(payload: {
  id: string;
  status: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/lawyer/profile/appointments/approve",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
