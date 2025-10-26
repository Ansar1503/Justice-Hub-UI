import { ResponseType } from "@/types/types/LoginResponseTypes";
import {
  Availability,
  OverrideDate,
  OverrideDateResponse,
  slotSettings,
} from "@/types/types/SlotTypes";
import {
  addOverrideSlots,
  removeOverrideSlot,
  updateAvailableSlots,
  updateScheduleSettings,
} from "@/utils/api/services/LawyerServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function UpdateScheduleSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType & { data: slotSettings },
    Error,
    slotSettings
  >({
    mutationFn: (payload: slotSettings) => updateScheduleSettings(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      console.log("data", data);
      queryClient.setQueryData(["schedule", "settings"], data.data);
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

export function useUpdateAvailableSlots() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType & { data: Availability },
    Error,
    Availability
  >({
    mutationFn: (payload: Availability) => updateAvailableSlots(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.setQueryData(["schedule", "availability"], data.data);
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

export function useAddOverrideSlots() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType & { data: OverrideDateResponse },
    Error,
    OverrideDate[]
  >({
    mutationFn: (payload: OverrideDate[]) => addOverrideSlots(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.setQueryData(["schedule", "overrides"], data.data);
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

export function useDeleteOverrideSlot() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType & { data: OverrideDateResponse },
    Error,
    Date
  >({
    mutationFn: (payload) => removeOverrideSlot(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.setQueryData(["schedule", "overrides"], data.data);
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
