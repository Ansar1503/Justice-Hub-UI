import { CreateblogType } from "@/types/types/BlogType";
import axiosinstance from "../axios/axios.instance";
import { BlogRoute } from "@/utils/constants/RouteConstants";

export async function AddBlog(params: CreateblogType) {
  const response = await axiosinstance.post(BlogRoute.base, params);
  return response.data;
}
