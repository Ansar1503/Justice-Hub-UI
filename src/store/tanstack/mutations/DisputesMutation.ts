import { Disputes } from "@/types/types/Disputes";
import { updateDisputesStatus } from "@/utils/api/services/adminServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateDisputeStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    {
      action: Disputes["resolveAction"];
      status: Disputes["status"];
      disputesId: string;
    }
  >({
    mutationFn: (payload) => updateDisputesStatus(payload),
    onSuccess: (data) => {
      console.log("disputes status data : ", data);
      queryClient.invalidateQueries({
        queryKey: ["admin", "disputes", "chat"],
      });
    },
    onError: (error: any) => {
      console.log("error ", error);
      const message =
        error.response.data?.message ||
        "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}
