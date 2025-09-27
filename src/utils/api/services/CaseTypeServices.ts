import { store } from "@/store/redux/store";
import { CaseTypeFetchQuery } from "@/types/types/CaseType";
import axiosinstance from "../axios/axios.instance";
import {
  CasetypeRoutes,
  CommonQueies,
  PracticeAreaRoutes,
} from "@/utils/constants/RouteConstants";

export async function fetchAllCaseTypes(queries: CaseTypeFetchQuery) {
  const { limit, page, pid, search } = queries;
  const { user } = store.getState().Auth;
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
      pid
  );
  return response.data;
}

export async function AddCaseType(payload: { name: string; pid: string }) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api + user?.role + CasetypeRoutes.base,
    payload
  );
  return response.data;
}

export async function UpdateCasetype(payload: {
  name: string;
  pid: string;
  id: string;
}) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.put(
    CommonQueies.api + user?.role + CasetypeRoutes.base,
    payload
  );
  return response.data;
}

export async function DeleteCasetype(id: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.delete(
    CommonQueies.api +
      user?.role +
      CasetypeRoutes.base +
      CommonQueies.params +
      id
  );
  return response.data;
}

export async function FetchAllCasetype() {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api + user?.role + CasetypeRoutes.base
  );
  return response.data;
}

export async function FetchCasetypeByPractice(payload: string[] | undefined) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      CasetypeRoutes.base +
      PracticeAreaRoutes.base,
    { params: { pids: payload } }
  );
  return response.data;
}
