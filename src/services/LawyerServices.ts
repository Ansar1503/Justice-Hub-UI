import { store } from "@/Redux/store";
import axiosinstance from "@/utils/api/axios/axios.instance";

export async function LawyerVerification(formData: any) {
  console.log("formdata", formData);
  const { token } = store.getState().Auth;
  const response = await axiosinstance.post("/api/lawyer/verification", formData, {
    headers: { Authorization: `Bearer ${token}`,
        "Content-Type":"multipart/form-data"
     },
  });
  return response.data
}
