import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { CasesRoutes, CommonQueies } from "@/utils/constants/RouteConstants";
import { FetchCasesDocumentsByCaseQueryType } from "@/types/types/CaseDocument";

export async function UploadCaseDocument(form: FormData) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api + user?.role + CasesRoutes.base + CasesRoutes.documents,
    form
  );
  return response.data;
}

export async function FethcAllCaseDocumentsByCase(
  query: FetchCasesDocumentsByCaseQueryType
) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      CasesRoutes.base +
      CasesRoutes.documents +
      CommonQueies.params +
      query.caseId,
    {
      params: query,
    }
  );
  return response.data;
}

export async function DeleteCaseDocument(id: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.delete(
    CommonQueies.api +
      user?.role +
      CasesRoutes.base +
      CasesRoutes.documents +
      CommonQueies.params +
      id
  );
  return response.data; 
}
