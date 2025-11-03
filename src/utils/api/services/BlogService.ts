import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { BlogRoute, CommonQueies } from "@/utils/constants/RouteConstants";
import { FetchBlogsByLawyerQueryType } from "@/types/types/BlogType";

export async function AddBlog(params: FormData) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api + user?.role + BlogRoute.base,
    params,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}

export async function FetchBlogsByLawyer(query: FetchBlogsByLawyerQueryType) {
  const { user } = store.getState().Auth;
  const { filter, limit, page, search, sort } = query;
  const response = await axiosinstance.get(
    `${CommonQueies.api}${user?.role}${BlogRoute.base}`,
    {
      params: {
        page,
        limit,
        search,
        filter,
        sort,
      },
    }
  );
  return response.data;
}

export async function UpdateBlog(payload: { id: string; params: FormData }) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `${CommonQueies.api}${user?.role}${BlogRoute.base}${CommonQueies.params}${payload.id}`,
    payload.params
  );
  return response.data;
}

export async function DeleteBlog(id: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.delete(
    `${CommonQueies.api}${user?.role}${BlogRoute.base}${CommonQueies.params}${id}`
  );
  return response.data;
}

export async function ToggleBlogStatus(id: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `${CommonQueies.api}${user?.role}${BlogRoute.base}${BlogRoute.publish}${CommonQueies.params}${id}`
  );
  return response.data;
}

export async function fetchBlogDetailsById(blogId: string | undefined) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    `${CommonQueies.api}${user?.role}${BlogRoute.base}${BlogRoute.users}${CommonQueies.params}${blogId}`
  );
  return response.data;
}

export async function ToggleBlogLike(blogId: string) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.patch(
    `${CommonQueies.api}${user?.role}${BlogRoute.base}${BlogRoute.like}${CommonQueies.params}${blogId}`
  );
  return response.data;
}
