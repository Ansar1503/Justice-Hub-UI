import {
  fetchClientData,
  fetchLawyerDetails,
  fetchLawyersByQuery,
} from "@/utils/api/services/clientServices";
import {
  fetchAllLawyers,
  fetchUserByRole,
} from "@/utils/api/services/adminServices";
import { useQuery } from "@tanstack/react-query";
import {
  fetchBlockedDates,
  fetchLawyerData,
} from "@/utils/api/services/LawyerServices";
import { LawyerFilterParams } from "@/types/types/Client.data.type";

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
}) {
  return useQuery({
    queryKey: ["user", query.role],
    queryFn: () => fetchUserByRole(query),
    staleTime: 1000 * 60 * 10,
    retry: 0,
  });
}

export function useFetchAllLawyers() {
  return useQuery({
    queryKey: ["lawyers"],
    queryFn: fetchAllLawyers,
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
    queryKey: ["lawyer", "details"],
    queryFn: () => fetchLawyerDetails(user_id),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFetchBlockedDates() {
  return useQuery({
    queryKey: ["schedule", "blocked"],
    queryFn: fetchBlockedDates,
    staleTime: 1000 * 60 * 10,
  });
}
