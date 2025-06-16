import { ResponseType } from "@/types/types/LoginResponseTypes";
import { cancelSessionByClient } from "@/utils/api/services/clientServices";
import { cancelSessionByLawyer } from "@/utils/api/services/LawyerServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useCancelSessionByLawyer() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType & { data?: any }, Error, { id: string }>({
    mutationFn: (payload) => cancelSessionByLawyer(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Session cancelled successfully!");
      queryClient.setQueryData(["lawyer", "sessions"], (old: any) => {
        return {
          ...old,
          data: old?.data?.map((appt: any) =>
            appt._id === data?.data?._id
              ? { ...appt, status: data?.data?.status }
              : appt
          ),
        };
      });
    },
    onError: (error: any) => {
      const message =
        error.response.data?.message ||
        "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useCancelSessionByClient() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType & { data?: any }, Error, { id: string }>({
    mutationFn: (payload) => cancelSessionByClient(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Session cancelled successfully!");
      queryClient.setQueryData(["client", "sessions"], (old: any) => {
        return {
          ...old,
          data: old?.data?.map((appt: any) =>
            appt._id === data?.data?._id
              ? { ...appt, status: data?.data?.status }
              : appt
          ),
        };
      });
    },
    onError: (error: any) => {
      const message =
        error.response.data?.message ||
        "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}
