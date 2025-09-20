import { store } from "@/store/redux/store";
import { CaseTypeFetchQuery } from "@/types/types/CaseType";
import axiosinstance from "../axios/axios.instance";
import { CasetypeRoutes, CommonQueies } from "@/utils/constants/RouteConstants";

export async function fetchAllCaseTypes(queries: CaseTypeFetchQuery) {
  const { limit, page, pid, search } = queries;
  const { token, user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      CasetypeRoutes.base +
      CommonQueies.pageQuery +
      page +
      CommonQueies.limitQuery +
      limit +
      CommonQueies.searchQuery +
      search +
      CasetypeRoutes.pidQuery +
      pid,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function AddCaseType(payload: { name: string; pid: string }) {
  const { user, token } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api + user?.role + CasetypeRoutes.base,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function UpdateCasetype(payload: {
  name: string;
  pid: string;
  id: string;
}) {
  const { user, token } = store.getState().Auth;
  const response = await axiosinstance.put(
    CommonQueies.api + user?.role + CasetypeRoutes.base,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function DeleteCasetype(id: string) {
  const { user, token } = store.getState().Auth;
  const response = await axiosinstance.delete(
    CommonQueies.api +
      user?.role +
      CasetypeRoutes.base +
      CommonQueies.params +
      id,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function FetchAllCasetype() {
  const { user, token } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api + user?.role + CasetypeRoutes.base,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
