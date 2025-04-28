/* eslint-disable @typescript-eslint/no-explicit-any */
import { setToken, setUser } from "@/Redux/Auth/Auth.Slice";
import { useAppDispatch } from "@/Redux/Hook";
import { LawyerVerification } from "@/services/LawyerServices";
import { loginUser } from "@/services/UserServices";
import { blockUser } from "@/services/adminServices";
import {
  sendVerificationMail,
  updateAddress,
  updateBasicInfo,
  updateEmail,
  updatePassword,
} from "@/services/clientServices";
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

export function useLoginMutation() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // console.log("data", data);
      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
      toast.success(data.message);
      navigate(`/${data.user.role}/`);
    },
    onError: (error: any) => {
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
      queryClient.invalidateQueries({ queryKey: ["client"] });
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
      queryClient.invalidateQueries({ queryKey: ["client"] });
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
      queryClient.invalidateQueries({ queryKey: ["client"] });
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
      queryClient.invalidateQueries({ queryKey: ["client"] });
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
        error.response.data?.message || "user Block failed! Try again";
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
