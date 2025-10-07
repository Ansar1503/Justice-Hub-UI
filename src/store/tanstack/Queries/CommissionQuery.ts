import { CommissionSettingstype } from "@/types/types/CommissionType";
import { FetchCommissionSettings } from "@/utils/api/services/CommissionServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchCommissionSettings() {
  return useQuery<CommissionSettingstype>({
    queryKey: ["commission", "settings"],
    queryFn: () => FetchCommissionSettings(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 0,
  });
}
