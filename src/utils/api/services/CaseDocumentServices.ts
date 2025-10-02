import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { CasesRoutes, CommonQueies } from "@/utils/constants/RouteConstants";

export async function UploadCaseDocument(form: FormData) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api + user?.role + CasesRoutes.base + CasesRoutes.documents,
    form
  );
  return response.data;
}
