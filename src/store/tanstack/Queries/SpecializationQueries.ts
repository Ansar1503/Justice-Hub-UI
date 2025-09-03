import {
  FetchSpecializationRequestPayloadType,
  SpecializationsResponseTypeWithPagination,
} from "@/types/types/SpecializationType";
import { fetchAllSpecializations } from "@/utils/api/services/commonServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllSpecializations(
  payload: FetchSpecializationRequestPayloadType
) {
  return useQuery<SpecializationsResponseTypeWithPagination, Error>({
    queryKey: ["specialization", payload],
    queryFn: () => fetchAllSpecializations(payload),
    staleTime: 1000 * 60,
    refetchInterval: false,
    enabled: Boolean(payload?.page && payload?.limit),
  });
}
