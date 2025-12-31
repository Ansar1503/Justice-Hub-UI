import { EmailUpdateResponse } from "@/store/tanstack/mutations";
import { store } from "@/store/redux/store";
import {
  AddressType,
  LawyerFilterParams,
} from "@/types/types/Client.data.type";
import axiosinstance from "@/utils/api/axios/axios.instance";
import {
  AppointmentStatus,
  AppointmentType,
  SortField,
  SortOrder,
} from "@/components/users/AppointmentsComponent";
import { Review } from "@/types/types/Review";
import {
  ClientRoutes,
  CommonQueies,
  profileQueries,
} from "@/utils/constants/RouteConstants";
import { Appointment } from "@/types/types/AppointmentsType";
import { PaymentfetchPayload } from "@/types/types/PaymentType";

export async function fetchClientData() {
  const response = await axiosinstance.get(`/api/client/profile`);
  return response.data;
}

export async function fetchProfileImage() {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api + user?.role + profileQueries.base + profileQueries.image
  );
  return response.data;
}

export async function updateBasicInfo(basicInfo: FormData) {
  const response = await axiosinstance.put(
    "/api/client/profile/basic/",
    basicInfo
  );
  return response.data;
}

export async function updateEmail(payload: {
  email: string;
}): Promise<EmailUpdateResponse> {
  const response = await axiosinstance.put(
    "/api/client/profile/personal",
    payload
  );
  return response.data;
}

export async function sendVerificationMail(payload: { email: string }) {
  const response = await axiosinstance.post(
    "/api/client/profile/verifyMail",
    payload
  );
  return response.data;
}

export async function updatePassword(payload: {
  password: string;
  currentPassword: string;
}) {
  const response = await axiosinstance.put(
    "/api/client/profile/updatePassword",
    payload
  );
  return response.data;
}

export async function updateAddress(payload: AddressType) {
  const response = await axiosinstance.post(
    "api/client/profile/address",
    payload
  );
  return response.data;
}

export async function fetchLawyersByQuery(payload: LawyerFilterParams) {
  const response = await axiosinstance.get(`api/client/lawyers`, {
    params: payload,
  });
  return response.data;
}

export async function fetchLawyerDetails(user_id: string) {
  const response = await axiosinstance.get(`api/client/lawyers/${user_id}`, {});
  return response.data;
}

export async function addReview(payload: {
  review: string;
  rating: number;
  lawyerId: string;
  heading: string;
  sessionId: string;
}) {
  const response = await axiosinstance.post(
    `/api/client/lawyers/review`,
    payload
  );
  return response.data;
}

export async function fetchSlotsforClients(
  lawyer_id: string,
  date: Date
): Promise<
  ResponseType & { data: { isAvailable: boolean; slots: string[] | [] } }
> {
  const response = await axiosinstance.get(
    `/api/client/lawyers/slots/${lawyer_id}?date=${date}`
  );
  return response.data;
}

export async function FetchAmountPayable(payload: {
  type: Appointment["type"];
  lawyerId: string;
}) {
  const response = await axiosinstance.get(
    `/api/client/lawyer/slots/pricedetails/${payload.lawyerId}?type=${payload.type}`
  );

  return response.data;
}

export async function bookAppointment(formData: FormData) {
  const response = await axiosinstance.post(
    `/api/client/lawyers/book`,
    formData
  );
  return response.data;
}

export async function fetchLawyerSlotSettings(lawyer_id: string) {
  const response = await axiosinstance.get(
    `/api/client/lawyers/settings/${lawyer_id}`
  );
  return response.data;
}

export async function fetchAppointmentsForClient(payload: {
  search?: string;
  appointmentStatus: AppointmentStatus;
  appointmentType: AppointmentType;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}) {
  // console.log("payload", payload);

  const response = await axiosinstance.get(
    `/api/client/profile/appointments?search=${payload.search}&appointmentStatus=${payload.appointmentStatus}&consultationType=${payload.appointmentType}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&page=${payload.page}&limit=${payload.limit}`
  );
  return response.data;
}

export async function cancellAppointment(payload: {
  id: string;
  status: string;
}) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/${user?.role}/profile/appointments`,
    payload
  );
  return response.data;
}

export async function cancelSessionByClient(payload: { id: string }) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `/api/${user?.role}/profile/sessions/cancel`,
    payload
  );
  return response.data;
}

export async function fetchChatsForClientApi(cursor = 1, search: string) {
  const response = await axiosinstance.get(
    `/api/client/profile/chats?cursor=${cursor}&search=${search}`
  );
  return response.data;
}

export async function fetchChatMessages(cursor = 1, sessionId: string) {
  const response = await axiosinstance.get(
    `/api/client/profile/chats/messages?cursor=${cursor}&sId=${sessionId}`
  );
  // console.log("response-data-----:", response.data);
  return response.data;
}

export async function uploadDocuments(
  payload: FormData,
  setProgress?: (value: number) => void
) {
  const response = await axiosinstance.post(
    `/api/client/profile/sessions/document`,
    payload,
    {
      onUploadProgress: (progressEvent) => {
        // console.log("progressevent", progressEvent);
        if (setProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        }
      },
    }
  );

  return response.data;
}

export async function fetchSessionDocuments(sessionId: string) {
  const { user } = store.getState().Auth;
  if (!user?.role) return;
  const response = await axiosinstance.get(
    `/api/${user?.role}/profile/sessions/document/${sessionId}`
  );
  return response.data;
}

export async function removeDocumentFile(id: string, sessionId: string) {
  const response = await axiosinstance.delete(
    `/api/client/profile/sessions/document/${id}?session=${sessionId}`
  );
  return response.data;
}

export async function fetchReviews(pageParam: any, lawyer_id: string) {
  // console.log("lawyerId", lawyer_id, "cursort", pageParam);

  const response = await axiosinstance.get(
    `/api/client/lawyers/reviews/${lawyer_id}?cursor=${pageParam}`
  );
  return response.data;
}

export async function fetchReviewsBySession(sessionId: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/${user?.role}/profile/sessions/reviews/${sessionId}`
  );
  return response.data;
}

export async function updateReview(payload: Partial<Review>) {
  const response = await axiosinstance.put(
    `/api/client/profile/reviews/${payload.id}`,
    payload
  );
  return response.data;
}

export async function deleteReview(payload: { review_id: string }) {
  const response = await axiosinstance.delete(
    `/api/client/profile/reviews/${payload.review_id}`
  );
  return response.data;
}

export async function reportReview(payload: {
  review_id: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
}) {
  const response = await axiosinstance.post(
    `/api/client/profile/reviews/report/${payload.review_id}`,
    {
      reason: payload.reason,
      reportedBy: payload.reportedBy,
      reportedUser: payload.reportedUser,
    }
  );
  return response.data;
}

export async function FetchClientDashboardData() {
  const response = await axiosinstance.get(
    CommonQueies.api + ClientRoutes.base + ClientRoutes.dashboard
  );
  return response.data;
}

export async function FetchAllPayments(params: PaymentfetchPayload) {
  const response = await axiosinstance.get(
    CommonQueies.api + ClientRoutes.base + ClientRoutes.payments,
    {
      params,
    }
  );
  return response.data;
}
