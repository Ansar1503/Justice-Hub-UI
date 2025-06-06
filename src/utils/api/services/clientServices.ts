import { EmailUpdateResponse } from "@/store/tanstack/mutations";
import { store } from "@/store/redux/store";
import {
  AddressType,
  LawyerFilterParams,
} from "@/types/types/Client.data.type";
import { BasicUpdateResponse } from "@/types/types/LoginResponseTypes";
import axiosinstance from "@/utils/api/axios/axios.instance";

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
