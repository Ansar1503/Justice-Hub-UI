import { store } from "@/store/redux/store";
import { ResponseType } from "@/types/types/LoginResponseTypes";
import { SessionDocument } from "@/types/types/sessionType";
import {
  cancelSessionByClient,
  removeDocumentFile,
} from "@/utils/api/services/clientServices";
import {
  cancelSessionByLawyer,
  endSession,
  StartSession,
} from "@/utils/api/services/LawyerServices";
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

export function useStartSession() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType & { data?: any },
    Error,
    { sessionId: string }
  >({
    mutationFn: (payload) => StartSession(payload.sessionId),
    onSuccess: (data) => {
      toast.success(data?.message || "Session started successfully!");
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

export function useRemoveFile(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation<ResponseType & { data?: SessionDocument }, Error, string>({
    mutationFn: (id) => removeDocumentFile(id, sessionId),
    onSuccess: (data) => {
      toast.success(data?.message || "Session started successfully!");
      console.log("data after remove", data);
      queryClient.setQueryData(
        ["session", "documents", sessionId],
        (old: ResponseType & { data?: SessionDocument }) => {
          old.data =
            !old?.data || !data?.data
              ? undefined
              : {
                  ...old.data,
                  document: data.data.document,
                };
          return old;
        }
      );
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
