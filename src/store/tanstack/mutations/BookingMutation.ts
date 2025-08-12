import { ResponseType } from "@/types/types/LoginResponseTypes";
import { bookAppointment } from "@/utils/api/services/clientServices";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useBookingMutation() {
  return useMutation<ResponseType, Error, FormData>({
    mutationFn: (payload: FormData) => bookAppointment(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Booking successful!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Booking failed! Try again.";
      error.message = message;
      toast.error(message);
    },
  });
}
