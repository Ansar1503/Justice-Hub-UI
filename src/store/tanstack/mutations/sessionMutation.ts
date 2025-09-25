import { ResponseType } from "@/types/types/LoginResponseTypes";
import { Session } from "@/types/types/sessionType";
import { cancelSessionByClient } from "@/utils/api/services/clientServices";
import { joinVideoSession } from "@/utils/api/services/commonServices";
import {
  cancelSessionByLawyer,
  endSession,
  StartSession,
} from "@/utils/api/services/LawyerServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useCancelSessionByLawyer() {
  const queryClient = useQueryClient();
  return useMutation<ResponseType & { data?: any }, Error, { id: string }>({
    mutationFn: (payload) => cancelSessionByLawyer(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Session cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["cases", "sessions"] });
    },
    onError: (error: any) => {
      const message =
        error.response.data || "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useCancelSessionByClient() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string }>({
    mutationFn: (payload) => cancelSessionByClient(payload),
    onSuccess: (data) => {
      // console.log("data:", data);
      toast.success(data?.message || "Session cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["cases", "sessions"] });
    },
    onError: (error: any) => {
      const message =
        error.response.data || "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useStartSession() {
  const queryClient = useQueryClient();
  return useMutation<
    Session & { zc: { appId: number; token: string } },
    Error,
    { sessionId: string }
  >({
    mutationFn: (payload) => StartSession(payload.sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["cases", "sessions"] });
      toast.success("Session started successfully!");
    },

    onError: (error: any) => {
      const message =
        error.response.data || "Something went wrong please try again later!";
      toast.error(message);
    },
  });
}

export function useJoinSession() {
  const queryClient = useQueryClient();
  return useMutation<
    Session & { zc: { appId: number; token: string } },
    Error,
    { sessionId: string }
  >({
    mutationFn: (payload) => joinVideoSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["cases", "sessions"] });
      toast.success("Session started successfully!");
    },

    onError: (error: any) => {
      console.log("error:", error);
      const message =
        error.response.data?.error ||
        "Something went wrong please try again later!";
      if (typeof message === "string") {
        toast.error(message);
      }
    },
  });
}

export function useEndSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => endSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["cases", "sessions"] });
    },
    onError: (error: any) => {
      const message =
        error.response.data || "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}
