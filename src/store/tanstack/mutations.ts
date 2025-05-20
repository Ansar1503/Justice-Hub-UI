/* eslint-disable @typescript-eslint/no-explicit-any */
import { setToken, setUser } from "@/store/redux/auth/Auth.Slice";
import { useAppDispatch } from "@/store/redux/Hook";
import {
  addAvailableTimeSlot,
  addBlockedDates,
  addReccuringSlot,
  LawyerVerification,
  removeBlockedDate,
  removeOneAvailableSlot,
  removeRecurringSlot,
  updateAvailableSlot,
  updateRecurringSlot,
  updateScheduleSettings,
} from "@/utils/api/services/LawyerServices";
import { googlesignup, loginUser } from "@/utils/api/services/UserServices";
import {
  blockUser,
  changeLawyerVerificationStatus,
} from "@/utils/api/services/adminServices";
import {
  addReview,
  sendVerificationMail,
  updateAddress,
  updateBasicInfo,
  updateEmail,
  updatePassword,
} from "@/utils/api/services/clientServices";
import { AddressType } from "@/types/types/Client.data.type";
import {
  LoginPayload,
  LoginResponse,
  BasicUpdateResponse,
  ResponseType,
} from "@/types/types/LoginResponseTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { dayType, reccuringType, slotSettings } from "@/types/types/SlotTypes";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // console.log("data", data);
      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(`/${data.user.role}/`);
    },
    onError: (error: any) => {
      console.log("error", error);
      const message =
        error.response?.data?.message || "Login failed. Try again.";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useBasicInfoUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation<BasicUpdateResponse, Error, FormData>({
    mutationFn: updateBasicInfo,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "update failed! Try again";
      error.message = message;
      toast.error(message);
    },
  });
}

export type EmailUpdateResponse = Omit<LoginResponse, "token">;

export function useUpdateEmailMutation() {
  const queryClient = useQueryClient();
  return useMutation<EmailUpdateResponse, Error, { email: string }>({
    mutationFn: updateEmail,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "update failed! Try again.";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useSendVerificationMailMutation() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, { email: string }>({
    mutationFn: sendVerificationMail,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "update failed! Try again.";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useUpdatePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType,
    Error,
    { password: string; currentPassword: string }
  >({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "update failed! Try again.";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, AddressType>({
    mutationFn: updateAddress,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "update failed! Try again.";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType & { data: { role: "admin" | "client" | "lawyer" } },
    Error,
    string
  >({
    mutationFn: (user_id) => blockUser(user_id),
    onSuccess: (data) => {
      toast.success(data.message);
      const role = data.data.role;
      queryClient.invalidateQueries({ queryKey: ["user", role] });
    },
    onError: (error: any) => {
      const message =
        error.response.data?.message || "something went wrong! Try again";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useLawyerVerification() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, any>({
    mutationFn: (formData) => LawyerVerification(formData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      const message =
        error.response.data?.message || "lawyer verification failed!";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useChangeLawyerVerificationStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType,
    Error,
    {
      user_id: string;
      status: "verified" | "rejected" | "pending" | "requested";
    }
  >({
    mutationFn: (payload) => changeLawyerVerificationStatus(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
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

export function useGoogleSignupMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType,
    Error,
    { code: string; role: "lawyer" | "client" }
  >({
    mutationFn: (payload) => googlesignup(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
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

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType,
    Error,
    { lawyerId: string; rating: number; review: string }
  >({
    mutationFn: (payload) => addReview(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [""] });
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

export function useAddBlockedDates() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType & {
      data: {
        id: string;
        date: string;
        reason: string;
      }[];
    },
    Error,
    {
      date: string;
      reason: string;
    }
  >({
    mutationFn: (payload: { date: string; reason: string }) =>
      addBlockedDates(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["schedule", "blocked"] });
    },
    onError: (error: any) => {
      // console.log("errormessage", error);
      const message =
        error.response.data?.message ||
        "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useRemoveBlockedDate() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, { id: string }>({
    mutationFn: (payload: { id: string }) => removeBlockedDate(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["schedule", "blocked"] });
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

export function useAddRecurringSlot() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, { day: dayType }>({
    mutationFn: (payload) => addReccuringSlot(payload.day),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["schedule", "recurring"] });
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

export function useRemoveRecurringSlot() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, { day: dayType }>({
    mutationFn: (payload: { day: dayType }) => removeRecurringSlot(payload.day),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule", "recurring"] });
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

export function useUpdateRecurringSlot() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType,
    Error,
    {
      day: dayType;
      key: keyof Omit<reccuringType, "_id" | "day">;
      value: string | boolean;
    }
  >({
    mutationFn: (payload: {
      day: dayType;
      key: keyof Omit<reccuringType, "_id" | "day">;
      value: string | boolean;
    }) => updateRecurringSlot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule", "recurring"] });
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

export function useUpdateScheduleSettings() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, slotSettings>({
    mutationFn: (payload: slotSettings) => updateScheduleSettings(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["schedule", "settings"] });
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

export function useAddAvailableTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType & { data: any }, Error, { date: Date }>({
    mutationFn: (payload: { date: Date }) => addAvailableTimeSlot(payload),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["schedule", "availableslot"] });
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

export function useRemoveOneAvailableSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { date: Date; startTime: string; endTime: string }) =>
      removeOneAvailableSlot(payload),
    onSuccess: (data) => {
      toast.success(data.success);
      queryClient.invalidateQueries({ queryKey: ["schedule", "availableslot"] });
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

export function useUpdateAvailableSlot() {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      prev: { date: Date; startTime: string; endTime: string };
      update: { key: "startTime" | "endTime"; value: string };
    }) => updateAvailableSlot(payload),
    onError: (error: any) => {
      const message =
        error.response.data?.message ||
        "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}
