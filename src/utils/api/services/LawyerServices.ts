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
  const response = await axiosinstance.post(
    "/api/lawyer/verification",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function fetchLawyerData() {
  const response = await axiosinstance.get("/api/lawyer/");
  return response.data;
}

export async function updateScheduleSettings(payload: slotSettings) {
  const response = await axiosinstance.patch(
    `/api/lawyer/schedule/settings`,
    payload
  );
  return response.data;
}

export async function fetchSlotSettings() {
  const response = await axiosinstance.get(`/api/lawyer/schedule/settings`);
  return response.data;
}

export async function updateAvailableSlots(payload: Availability) {
  const response = await axiosinstance.patch(
    `/api/lawyer/schedule/availability`,
    payload
  );
  return response.data;
}

export async function fetchAvailableSlots() {
  const response = await axiosinstance.get(`/api/lawyer/schedule/availability`);
  return response.data;
}

export async function addOverrideSlots(payload: OverrideDate[]) {
  const response = await axiosinstance.post(
    `/api/lawyer/schedule/override`,
    payload
  );
  return response.data;
}

export async function fetchOverrideslots() {
  const response = await axiosinstance.get(`/api/lawyer/schedule/override`);
  return response.data;
}

export async function removeOverrideSlot(overrideDate: Date) {
  const response = await axiosinstance.delete(
    `/api/lawyer/schedule/override?date=${overrideDate}`
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

  const response = await axiosinstance.get(
    `/api/lawyer/profile/appointments?search=${payload.search}&appointmentStatus=${payload.appointmentStatus}&consultationType=${payload.appointmentType}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&page=${payload.page}&limit=${payload.limit}`
  );
  return response.data;
}

export async function rejectClientAppointment(payload: {
  id: string;
  status: string;
}) {
  const response = await axiosinstance.patch(
    "/api/lawyer/profile/appointments/reject",
    payload
  );
  return response.data;
}

export async function confirmAppointment(payload: {
  id: string;
  status: string;
}) {
  const response = await axiosinstance.patch(
    "/api/lawyer/profile/appointments/approve",
    payload
  );
  return response.data;
}

export async function cancelSessionByLawyer(payload: { id: string }) {
  const response = await axiosinstance.patch(
    `/api/lawyer/profile/sessions/cancel`,
    payload
  );
  return response.data;
}

export async function StartSession(sessionId: string) {
  const response = await axiosinstance.patch(
    `/api/lawyer/profile/sessions/startSession`,
    {
      sessionId: sessionId,
    }
  );
  return response.data;
}

export async function endSession(sessionId: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/${user?.role}/profile/sessions/endSession`,
    {
      sessionId: sessionId,
    }
  );
  return response.data;
}

export async function fetchLawyersProfessionalDetails(
  userId: string | undefined
) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      profileQueries.base +
      profileQueries.lawyer.base +
      profileQueries.lawyer.professional +
      CommonQueies.params +
      userId
  );
  return response.data;
}

export async function FetchLawyersVerificationDetails(
  userId: string | undefined
) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      profileQueries.base +
      profileQueries.lawyer.base +
      profileQueries.lawyer.verification +
      CommonQueies.params +
      userId
  );
  return response.data;
}

export async function addLawyerProfessionalDetails(
  payload: ProfessionalDetailsFormData
) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api +
      user?.role +
      profileQueries.base +
      profileQueries.lawyer.base +
      profileQueries.lawyer.professional,
    payload
  );
  return response.data;
}
