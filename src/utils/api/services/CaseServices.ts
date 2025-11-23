import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { CasesRoutes, CommonQueies } from "@/utils/constants/RouteConstants";
import type { FetchCaseQueryType, UpdateCaseDetailsType } from "@/types/types/Case";

export async function FetchAllCasesByQuery(payload: FetchCaseQueryType) {
  const { user } = store.getState().Auth;

  const response = await axiosinstance.get(
    CommonQueies.api + user?.role + CasesRoutes.base,
    {
      params: {
        page: String(payload.page),
        limit: String(payload.limit),
        search: payload.search || "",
        sortOrder: payload.sortOrder,
        sortBy: payload.sortBy,
        status: payload.status,
        caseTypeFilter: payload.caseTypeFilter,
      },
    }
  );

  return response.data;
}

export async function FetchCaseDetails(id: string | undefined) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api + user?.role + CasesRoutes.base + CommonQueies.params + id
  );
  return response.data;
}

export async function FetchCaseAppointments(id: string | undefined) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
    user?.role +
    CasesRoutes.base +
    CasesRoutes.appointments +
    CommonQueies.params +
    id
  );
  return response.data;
}

export async function FetchCaseSessions(id: string | undefined) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
    user?.role +
    CasesRoutes.base +
    CasesRoutes.sessions +
    CommonQueies.params +
    id
  );
  return response.data;
}

export async function FetchAllCasesByUser() {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api + user?.role + CasesRoutes.base + CasesRoutes.user
  );
  return response.data;
}


export async function UpdateCaseDetails(payload: UpdateCaseDetailsType) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.put(
    CommonQueies.api + user?.role + CasesRoutes.base + CommonQueies.params + payload.caseId,
    payload
  );
  return response.data;
}