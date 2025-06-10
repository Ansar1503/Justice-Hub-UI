import {
  fetchAppointmentsForClient,
  fetchClientData,
  fetchLawyerDetails,
  fetchLawyersByQuery,
  fetchLawyerSlotSettings,
  fetchSlotsforClients,
} from "@/utils/api/services/clientServices";
import {
  fetchAllLawyers,
  fetchUserByRole,
} from "@/utils/api/services/adminServices";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAppointmentsForLawyers,
  fetchAvailableSlots,
  fetchLawyerData,
  fetchOverrideslots,
  fetchSlotSettings,
} from "@/utils/api/services/LawyerServices";
import { LawyerFilterParams } from "@/types/types/Client.data.type";
import {
  Availability,
  OverrideDateResponse,
  slotSettings,
} from "@/types/types/SlotTypes";
import {
  AppointmentStatus,
  AppointmentType,
  SortField,
  SortOrder,
} from "@/components/users/AppointmentsComponent";
import { ResponseType } from "@/types/types/LoginResponseTypes";

export function useFetchClientData() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchClientData,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchLawyerData() {
  return useQuery({
    queryKey: ["lawyer"],
    queryFn: fetchLawyerData,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchUsersByRole(query: {
  role: "lawyer" | "client";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  status: "all" | "verified" | "blocked";
}) {
  return useQuery({
    queryKey: ["user", query.role],
    queryFn: () => fetchUserByRole(query),
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}

export function useFetchAllLawyers(query: {
  sort?: "name" | "experience" | "consultation_fee" | "createdAt";
  order?: "asc" | "desc";
  page: number;
  limit: number;
  status?: "all" | "verified" | "rejected" | "pending" | "requested";
  search: string;
}) {
  return useQuery({
    queryKey: ["lawyers"],
    queryFn: () => fetchAllLawyers(query),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchLawyersByQuery(query: LawyerFilterParams) {
  return useQuery({
    queryKey: ["lawyers", "queries"],
    queryFn: () => fetchLawyersByQuery(query),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchLawyerDetails(user_id: string) {
  return useQuery({
    queryKey: ["lawyer", "details", user_id],
    queryFn: () => fetchLawyerDetails(user_id),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchSlotSettings() {
  return useQuery<ResponseType & { data: slotSettings }, Error>({
    queryKey: ["schedule", "settings"],
    queryFn: fetchSlotSettings,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchLawyerSlotSettings(lawyer_id: string) {
  return useQuery<ResponseType & { data: slotSettings }, Error>({
    queryKey: ["schedule", "settings", lawyer_id],
    queryFn: () => fetchLawyerSlotSettings(lawyer_id),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchAvailableSlots() {
  return useQuery<ResponseType & { data: Availability }, Error>({
    queryKey: ["schedule", "availability"],
    queryFn: () => fetchAvailableSlots(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchOverrideSlots() {
  return useQuery<ResponseType & { data: OverrideDateResponse }, Error>({
    queryKey: ["schedule", "overrides"],
    queryFn: () => fetchOverrideslots(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchSlotsforClients(id: string, date: Date) {
  return useQuery({
    queryKey: ["schedule", "slots", id, date],
    queryFn: () => fetchSlotsforClients(id, date),
    staleTime: 1000 * 60 * 10,
    enabled: id !== "" && !date,
  });
}

export function useFetchAppointmentsForClients(payload: {
  search?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["client", "appointments"],
    queryFn: () => fetchAppointmentsForClient(payload),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchAppointmentsForLawyers(payload: {
  search?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["lawyer", "appointments"],
    queryFn: () => fetchAppointmentsForLawyers(payload),
    staleTime: 1000 * 60 * 10,
  });
}
