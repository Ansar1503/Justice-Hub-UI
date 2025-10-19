import { SubscriptionType } from "@/types/types/SubscriptionType";
import { AddSubscriptionPlan, FetchAllSubscriptionPlans } from "@/utils/api/services/SubscriptionServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddSubscriptionMutation() {
  return useMutation<
    SubscriptionType,
    any,
    Omit<SubscriptionType, "id" | "createdAt" | "updatedAt">
  >({
    onError: (error: any) => {
      const message = error.response?.data?.message || "subscription add error";
      error.message = message;
      toast.error(message);
    },
    onSettled() {},
    mutationFn: AddSubscriptionPlan,
  });
}

export function useFetchAllSubscriptionPlans() {
  return useQuery<SubscriptionType[]>({
    queryKey: ["subscription-plans"],
    queryFn: FetchAllSubscriptionPlans,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
