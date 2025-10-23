import {
  SubscriptionType,
  UserSubscriptionType,
} from "@/types/types/SubscriptionType";
import {
  AddSubscriptionPlan,
  ChangeActiveSubscriptionStatus,
  FetchAllSubscriptionPlans,
  FetchCurrentUserSubscription,
  SubscribePlan,
  UpdateSubscriptionPlan,
} from "@/utils/api/services/SubscriptionServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    SubscriptionType,
    any,
    Omit<SubscriptionType, "id" | "createdAt" | "updatedAt">
  >({
    onError: (error: any) => {
      const message = error.response?.data?.error || "subscription add error";
      error.message = message;
      toast.error(message);
    },
    onSettled(newdata) {
      queryClient.setQueryData<SubscriptionType[]>(
        ["subscription-plans"],
        (old) => {
          if (!old) return newdata ? [newdata] : [];

          return newdata ? [...old, newdata] : old;
        }
      );
      toast.success("Subscription Plan Added");
    },
    mutationFn: AddSubscriptionPlan,
  });
}

export function useFetchAllSubscriptionPlans() {
  return useQuery<SubscriptionType[]>({
    queryKey: ["subscription-plans"],
    queryFn: FetchAllSubscriptionPlans,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useFetchCurrentUserSubscription() {
  return useQuery<UserSubscriptionType>({
    queryKey: ["user-subscription"],
    queryFn: FetchCurrentUserSubscription,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation<
    SubscriptionType,
    any,
    Omit<SubscriptionType, "createdAt" | "updatedAt">
  >({
    mutationFn: UpdateSubscriptionPlan,
    onError: (error: any) => {
      const message =
        error.response?.data?.error || "subscription update error";
      error.message = message;
      toast.error(message);
    },
    onSettled(updateddata) {
      queryClient.setQueryData<SubscriptionType[]>(
        ["subscription-plans"],
        (old) => {
          if (!old) return old;

          return old.map((data) =>
            data.id === updateddata?.id ? { ...data, ...updateddata } : data
          );
        }
      );
      toast.success("Subscription Plan Updated");
    },
  });
}

export function useChangeActiveSubscriptionStatus() {
  const queryClient = useQueryClient();
  return useMutation<SubscriptionType, any, { id: string; status: boolean }>({
    mutationFn: ChangeActiveSubscriptionStatus,
    onError: (error) => {
      const message = error.response?.data?.error || "Something went wrong";
      error.message = message;
      toast.error(message);
    },
    onSettled(updatedData) {
      queryClient.setQueryData<SubscriptionType[]>(
        ["subscription-plans"],
        (old) => {
          if (!old) return old;

          return old.map((data) =>
            data.id === updatedData?.id ? { ...data, ...updatedData } : data
          );
        }
      );
      toast.success(
        updatedData?.isActive === true
          ? "Subscription Plan Activated"
          : "Subscription Plan Deactivated"
      );
    },
  });
}

export function useSubscibePlan() {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SubscribePlan,
    onError: (error: any) => {
      const message = error.response?.data?.error || "Something went wrong";
      error.message = message;
      toast.error(message);
    },
    onSettled() {},
  });
}
