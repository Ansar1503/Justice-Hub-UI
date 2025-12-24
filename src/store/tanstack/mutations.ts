import { setToken, setUser } from "@/store/redux/auth/Auth.Slice";
import { useAppDispatch } from "@/store/redux/Hook";
import {
  confirmAppointment,
  LawyerVerification,
  rejectClientAppointment,
} from "@/utils/api/services/LawyerServices";
import { loginUser } from "@/utils/api/services/UserServices";
import {
  ChangeBlockStatusUser,
  changeLawyerVerificationStatus,
  // deleteDisputeReview,
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
import {
  AddressType,
  clientDataType,
  fetchClientDataType,
} from "@/types/types/Client.data.type";
import {
  LoginPayload,
  LoginResponse,
  ResponseType,
} from "@/types/types/LoginResponseTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Review } from "@/types/types/Review";
import { FetchLawyerResponseType } from "@/types/types/LawyerTypes";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // console.log("data", data);
      dispatch(setUser(data.user));
      dispatch(setToken(data.accesstoken));
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(`/${data.user.role}/`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Login failed. Try again.";
      error.message = message;
      toast.error(message);
    },
  });
}

export function useBasicInfoUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation<clientDataType, Error, FormData>({
    mutationFn: updateBasicInfo,
    onSuccess: () => {
      toast.success("succeeded");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profileImage"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "update failed! Try again";
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
      console.log("error in update email", error);
      const message =
        error.response?.data?.error || "update failed! Try again.";
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
        error.response?.data?.error || "update failed! Try again.";
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
    ResponseType & {
      data: { role: "admin" | "client" | "lawyer"; status: boolean };
    },
    Error,
    { user_id: string; status: boolean }
  >({
    mutationFn: (payload) =>
      ChangeBlockStatusUser(payload.user_id, payload.status),
    onSuccess: (data) => {
      toast.success(data.message);
      // const queries = queryClient.getQueriesData({ queryKey: ["user"] });
      // const userDataEntry = queries.find(([_, data]: any[]) =>
      //   data?.data?.some((user) => user._id === userId)
      // );

      // console.log(userDataEntry);
      // -> [queryKey, fullQueryData]

      queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
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
  return useMutation<FetchLawyerResponseType, Error, any>({
    mutationFn: (formData) => LawyerVerification(formData),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["user", data?.user_id],
        (old: fetchClientDataType) => ({
          ...old,
          rejectReason: data?.rejectReason,
          lawyerVerfication: data?.verification_status,
        })
      );
    },
    onError: (error: any) => {
      const message =
        error.response.data?.error || "lawyer verification failed!";
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
      rejectReason?: string;
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
      toast.error(message);
    },
  });
}

// export function useGoogleSignupMutation() {
//   const queryClient = useQueryClient();
//   return useMutation<
//     ResponseType,
//     Error,
//     { code: string; role: "lawyer" | "client" }
//   >({
//     mutationFn: (payload) => googlesignup(payload),
//     onSuccess: (data) => {
//       toast.success(data.message);
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//     },
//     onError: (error: any) => {
//       const message =
//         error.response.data?.message ||
//         "Something went wrong please try again later!";
//       error.message = message;
//       toast.error(message);
//     },
//   });
// }

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
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
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
    mutationFn: (payload: {
      id: string;
      status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
    }) => cancellAppointment(payload),
    onSuccess: () => {
      toast.success("Appointment cancelled!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["cases", "appointments"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });
}

export function useRejectAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      id: string;
      status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
    }) => rejectClientAppointment(payload),
    onSuccess: (updated) => {
      toast.success(updated.message);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["cases", "appointments"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
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
    mutationFn: (payload: {
      id: string;
      status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
    }) => confirmAppointment(payload),
    onSuccess: (updated) => {
      toast.success(updated.message);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["cases", "appointments"] });
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
      queryClient.setQueryData(["review", data?.lawyer_id], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((review: any) =>
              review.id === data?.id ? { ...review, ...data } : review
            ),
          })),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || error?.error || "Something went wrong!";
      toast.error(message);
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { review_id: string }) => deleteReview(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["review", data?.lawyer_id], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((r: any) => r.id !== data.id),
          })),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
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

// export function useDeleteDisputeReview() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: { reviewId: string; diputeId: string }) =>
//       deleteDisputeReview(payload),
//     onSuccess: () => {
//       // toast.success("Review Deleted Successfully");
//       queryClient.invalidateQueries({
//         queryKey: ["admin", "disputes", "review"],
//       });
//     },
//     onError: (error: any) => {
//       console.log("error :", error);
//       const message =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Something went wrong!";
//       toast.error(message);
//     },
//   });
// }
