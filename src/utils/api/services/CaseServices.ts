import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { CasesRoutes, CommonQueies } from "@/utils/constants/RouteConstants";
import { FetchCaseQueryType } from "@/types/types/Case";

export async function FetchAllCasesByQuery(payload: FetchCaseQueryType) {
  const { user, token } = store.getState().Auth;

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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function FetchCaseDetails(id: string | undefined) {
  const { user, token } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api + user?.role + CasesRoutes.base + CommonQueies.params + id,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
