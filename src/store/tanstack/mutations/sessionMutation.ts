import { store } from "@/store/redux/store";
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
      console.log("data:", data);
      toast.success(data?.message || "Session cancelled successfully!");
      queryClient.setQueryData(["client", "sessions"], (old: any) => {
        console.log("old:", old);
        return {
          ...old,
          data: old?.data?.map((appt: any) =>
            appt._id === data?.id ? { ...appt, status: data?.status } : appt
          ),
        };
      });
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
      queryClient.invalidateQueries({ queryKey: ["client", "sessions"] });
      toast.success("Session started successfully!");
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

export function useJoinSession() {
  const queryClient = useQueryClient();
  return useMutation<
    Session & { zc: { appId: number; token: string } },
    Error,
    { sessionId: string }
  >({
    mutationFn: (payload) => joinVideoSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", "sessions"] });
      toast.success("Session started successfully!");
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

export function useEndSession() {
  const queryClient = useQueryClient();
  const { user } = store.getState().Auth;
  return useMutation({
    mutationFn: (sessionId: string) => endSession(sessionId),
    onSuccess: (data) => {
      console.log("new data:", data);
      if (user?.role === "lawyer") {
        queryClient.invalidateQueries({ queryKey: ["lawyer", "sessions"] });
      } else if (user?.role === "client") {
        queryClient.invalidateQueries({ queryKey: ["client", "sessions"] });
      }
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
