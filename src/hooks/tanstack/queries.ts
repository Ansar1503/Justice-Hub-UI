import { fetchClientData } from "@/services/clientServices";
import { fetchAllLawyers, fetchUserByRole } from "@/services/adminServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchClientData() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchClientData,
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
  });
}

export function useFetchAllLawyers() {
  return useQuery({
    queryKey: ["user", "lawyer"],
    queryFn: fetchAllLawyers,
    staleTime: 1000 * 60 * 10,
  });
}
