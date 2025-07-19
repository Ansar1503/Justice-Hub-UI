import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";

export async function sendFiles(payload: {
  file: File;
  sessionId: string;
  onProgress?: (progress: number) => void;
}) {
  const formData = new FormData();
  formData.append("sessionId", payload.sessionId);
  formData.append("file", payload.file);
  const { token, user } = store.getState().Auth;
  const response = await axiosinstance.post(
    `/api/${user?.role}/chat/sendFile`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress =
          Math.round(progressEvent.loaded * 100) / (progressEvent.total || 1);
        if (payload.onProgress) payload.onProgress(progress);
      },
    }
  );

  return response.data;
}
