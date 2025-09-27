import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import {
  CommonQueies,
  PracticeAreaRoutes,
} from "@/utils/constants/RouteConstants";
import { PracticeAreaQuery } from "@/types/types/PracticeAreaType";

export async function AddPracticeArea(payload: {
  name: string;
  specId: string;
}) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api + user?.role + PracticeAreaRoutes.base,
    payload
  );
  return response.data;
}

export async function FetchAllPracticeAreas(query: PracticeAreaQuery) {
  const { limit, page, search, specId } = query;
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      PracticeAreaRoutes.base +
      CommonQueies.pageQuery +
      page +
      CommonQueies.limitQuery +
      limit +
      CommonQueies.searchQuery +
      search +
      PracticeAreaRoutes.specIdQuery +
      specId
  );
  return response.data;
}

export async function updatePracticeArea(payload: {
  id: string;
  name: string;
  specId: string;
}) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.put(
    CommonQueies.api + user?.role + PracticeAreaRoutes.base,
    payload
  );
  return response.data;
}

export async function deletePracticeArea(id: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.delete(
    CommonQueies.api +
      user?.role +
      PracticeAreaRoutes.base +
      CommonQueies.params +
      id
  );
  return response.data;
}

export async function fetchPracticeAreasbySpecIds(query: string[] | []) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api + user?.role + PracticeAreaRoutes.base,
    {
      params: { specIds: query },
    }
  );
  return response.data;
}
