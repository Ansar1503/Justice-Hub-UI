import { CommissionSettingstype } from "@/types/types/CommissionType";
import { AddCommissionSettings } from "@/utils/api/services/adminServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddCommissionSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    CommissionSettingstype,
    any,
    {
      id?: string;
      initialCommission: number;
      followupCommission: number;
    }
  >({
    mutationFn: AddCommissionSettings,
    onError: (error) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Error adding CommissionSettings");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["commission", "settings"],
        exact: false,
      });
    },
  });
}
