import { setToken, setUser } from "@/store/redux/auth/Auth.Slice";
import { useAppDispatch } from "@/store/redux/Hook";
import {
  confirmAppointment,
  LawyerVerification,
  rejectClientAppointment,
} from "@/utils/api/services/LawyerServices";
import { googlesignup, loginUser } from "@/utils/api/services/UserServices";
import {
  blockUser,
  changeLawyerVerificationStatus,
  deleteDisputeReview,
} from "@/utils/api/services/adminServices";
import {
  addReview,
  cancellAppointment,
  deleteReview,
  reportReview,
  sendVerificationMail,
  updateAddress,
  updateBasicInfo,
  updateEmail,
  updatePassword,
  updateReview,
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
import { Review } from "@/types/types/Review";

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
    {
      lawyerId: string;
      rating: number;
      review: string;
      heading: string;
      sessionId: string;
    }
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

export function useCancellAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; status: string }) =>
      cancellAppointment(payload),
    onSuccess: (updated) => {
      toast.success("Appointment cancelled!");
      queryClient.setQueryData(["client", "appointments"], (old: any) => {
        return {
          ...old,
          data: old.data.map((appt: any) =>
            appt._id === updated.data._id
              ? { ...appt, status: updated.data.status }
              : appt
          ),
        };
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });
}

export function useRejectAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; status: string }) =>
      rejectClientAppointment(payload),
    onSuccess: (updated) => {
      toast.success(updated.message);
      queryClient.setQueryData(["lawyer", "appointments"], (old: any) => {
        return {
          ...old,
          data: old?.data?.map((appt: any) =>
            appt._id === updated?.data?._id
              ? { ...appt, status: updated?.data?.status }
              : appt
          ),
        };
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; status: string }) =>
      confirmAppointment(payload),
    onSuccess: (updated) => {
      toast.success(updated.message);
      queryClient.setQueryData(["lawyer", "appointments"], (old: any) => {
        return {
          ...old,
          data: old?.data?.map((appt: any) =>
            appt._id === updated?.data?._id
              ? { ...appt, status: updated?.data?.status }
              : appt
          ),
        };
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Review>) => updateReview(payload),
    onSuccess: (data) => {
      // console.log("data", data);
      queryClient.setQueryData(
        ["client", "reviews", data?.session_id],
        (old: any | undefined) => {
          if (!old) return old;
          // console.log("oldData while update review : ", old);
          return old.map((review: any) => {
            if (review._id === data._id) {
              return {
                ...review,
                ...data,
                reviewedBy: review.reviewedBy,
              };
            }
            return review;
          });
        }
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { review_id: string }) => deleteReview(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["client", "reviews", data?.session_id],
        (old: any | undefined) => {
          if (!old) return old;
          return old.filter((review: any) => review._id !== data._id);
        }
      );
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });
}

export function useReportReview() {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      review_id: string;
      reportedBy: string;
      reportedUser: string;
      reason: string;
    }) => reportReview(payload),
    onSuccess: () => {
      toast.success("Review Reported Successfully");
      // queryClient.setQueryData(["client","reviews",data?.session])
    },
    onError: (error: any) => {
      console.log("error :", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });
}

export function useDeleteDisputeReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { reviewId: string; diputeId: string }) =>
      deleteDisputeReview(payload),
    onSuccess: () => {
      // toast.success("Review Deleted Successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin", "disputes", "review"],
      });
    },
    onError: (error: any) => {
      console.log("error :", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });
}

