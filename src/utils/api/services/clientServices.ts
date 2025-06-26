import { EmailUpdateResponse } from "@/store/tanstack/mutations";
import { store } from "@/store/redux/store";
import {
  AddressType,
  LawyerFilterParams,
} from "@/types/types/Client.data.type";
import { BasicUpdateResponse } from "@/types/types/LoginResponseTypes";
import axiosinstance from "@/utils/api/axios/axios.instance";
import {
  AppointmentStatus,
  AppointmentType,
  SortField,
  SortOrder,
} from "@/components/users/AppointmentsComponent";

export async function fetchClientData() {
  const { token } = store.getState().Auth;

  const response = await axiosinstance.get(`/api/client/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateBasicInfo(
  basicInfo: FormData
): Promise<BasicUpdateResponse> {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.put(
    "/api/client/profile/basic/",
    basicInfo,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function updateEmail(payload: {
  email: string;
}): Promise<EmailUpdateResponse> {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.put(
    "/api/client/profile/personal",
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function sendVerificationMail(payload: { email: string }) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    "/api/client/profile/verifyMail",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function updatePassword(payload: {
  password: string;
  currentPassword: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.put(
    "/api/client/profile/updatePassword",
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function updateAddress(payload: AddressType) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    "api/client/profile/address",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchLawyersByQuery(payload: LawyerFilterParams) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(`api/client/lawyers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: payload,
  });
  return response.data;
}

export async function fetchLawyerDetails(user_id: string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(`api/client/lawyers/${user_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function addReview(payload: {
  review: string;
  rating: number;
  lawyerId: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    `/api/client/lawyers/review`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchSlotsforClients(
  lawyer_id: string,
  date: Date
): Promise<
  ResponseType & { data: { isAvailable: boolean; slots: string[] | [] } }
> {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/client/lawyers/slots/${lawyer_id}?date=${date}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function bookAppointment(formData: FormData) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post(
    `/api/client/lawyers/book`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function fetchLawyerSlotSettings(lawyer_id: string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/client/lawyers/settings/${lawyer_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
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
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/client/profile/appointments?search=${payload.search}&appointmentStatus=${payload.appointmentStatus}&appointmentType=${payload.appointmentType}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&page=${payload.page}&limit=${payload.limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function cancellAppointment(payload: {
  id: string;
  status: string;
}) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/client/profile/appointments",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchSessionsforClients(payload: {
  search: string;
  status: string;
  sort: string;
  order: "asc" | "desc";
  consultation_type: string;
  page: number;
  limit: number;
}) {
  const { token } = store.getState().Auth;
  const { consultation_type, limit, order, page, search, sort, status } =
    payload;
  const response = await axiosinstance.get(
    `/api/client/profile/sessions?search=${search}&sort=${sort}&status=${status}&consultation_type=${consultation_type}&limit=${limit}&order=${order}&page=${page}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function cancelSessionByClient(payload: { id: string }) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.patch(
    "/api/client/profile/sessions/cancel",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function fetchChatsForClientApi(cursor = 1, search: string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/client/profile/chats?cursor=${cursor}&search=${search}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function fetchChatMessages(cursor = 1, sessionId: string) {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(
    `/api/client/profile/chats/messages?cursor=${cursor}&sId=${sessionId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function uploadDocuments(
  payload: FormData,
  setProgress?: (value: number) => void
) {
  const { token } = store.getState().Auth;

  const response = await axiosinstance.post(
    `/api/client/profile/sessions/document`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
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
  const response = await axiosinstance.get(
    `/api/client/profile/sessions/document/${sessionId}`,
    {
      headers: { Authorization: `Bearer ${store.getState().Auth.token}` },
    }
  );
  return response.data;
}
