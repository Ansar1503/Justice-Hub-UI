import { ProfessionalDetailsFormData } from "@/components/Lawyer/ProfessionalDetailsComponent";
import {
  AppointmentStatus,
  AppointmentType,
  SortOrder,
} from "@/components/users/AppointmentsComponent";
import { store } from "@/store/redux/store";
import {
  Availability,
  OverrideDate,
  slotSettings,
} from "@/types/types/SlotTypes";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { CommonQueies, profileQueries } from "@/utils/constants/RouteConstants";

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

export async function removeOverrideSlot(overrideDate: Date) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.delete(
    `/api/lawyer/schedule/override?date=${overrideDate}`,
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
  sortField: string;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  // console.log("payload", payload);
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/lawyer/profile/appointments?search=${payload.search}&appointmentStatus=${payload.appointmentStatus}&consultationType=${payload.appointmentType}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&page=${payload.page}&limit=${payload.limit}`,
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

export async function cancelSessionByLawyer(payload: { id: string }) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/lawyer/profile/sessions/cancel`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function StartSession(sessionId: string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/lawyer/profile/sessions/startSession`,
    {
      sessionId: sessionId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function endSession(sessionId: string) {
  const { token, user } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/${user?.role}/profile/sessions/endSession`,
    {
      sessionId: sessionId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchLawyersProfessionalDetails(
  userId: string | undefined
) {
  const { token, user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      profileQueries.base +
      profileQueries.lawyer.base +
      profileQueries.lawyer.professional +
      CommonQueies.params +
      userId,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function FetchLawyersVerificationDetails(
  userId: string | undefined
) {
  const { token, user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      profileQueries.base +
      profileQueries.lawyer.base +
      profileQueries.lawyer.verification +
      CommonQueies.params +
      userId,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function addLawyerProfessionalDetails(
  payload: ProfessionalDetailsFormData
) {
  const { token, user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api +
      user?.role +
      profileQueries.base +
      profileQueries.lawyer.base +
      profileQueries.lawyer.professional,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
