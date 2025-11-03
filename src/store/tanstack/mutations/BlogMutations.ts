import { BlogType, FetchedBlogByClient } from "@/types/types/BlogType";
import {
  AddBlog,
  DeleteBlog,
  ToggleBlogLike,
  ToggleBlogStatus,
  UpdateBlog,
} from "@/utils/api/services/BlogService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation<BlogType, any, FormData>({
    mutationFn: AddBlog,
    onError: (error) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Blog Adding failed");
    },
    onSuccess: (data) => {
      toast.success(`Blog ${data?.isPublished ? "Published" : "Drafted"}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyer", "blogs"] });
    },
  });
}

export function useEditBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation<BlogType, any, { id: string; params: FormData }>({
    mutationFn: UpdateBlog,

    onError: (error) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Blog update failed");
    },

    onSuccess: (data) => {
      toast.success("Blog updated successfully");
      queryClient.setQueriesData<{
        totalCount: number;
        currentPage: number;
        totalPage: number;
        data: BlogType[];
      }>({ queryKey: ["lawyer", "blogs"] }, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((blog: BlogType) =>
            blog.id === data.id ? data : blog
          ),
        };
      });
    },
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation<BlogType, any, string>({
    mutationFn: DeleteBlog,
    onError: (error) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Blog Delete failed");
    },
    onSuccess: () => {
      toast.success(`Blog deleted`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyer", "blogs"] });
    },
  });
}

export function useToggleBlogStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation<BlogType, any, string>({
    mutationFn: ToggleBlogStatus,
    onError: (error) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Blog status toggle failed");
    },
    onSuccess: (data) => {
      toast.success("Blog updated successfully");
      queryClient.setQueriesData<{
        totalCount: number;
        currentPage: number;
        totalPage: number;
        data: BlogType[];
      }>({ queryKey: ["lawyer", "blogs"] }, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((blog: BlogType) =>
            blog.id === data.id ? data : blog
          ),
        };
      });
    },
  });
}

export function useToggleBlogLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ToggleBlogLike,

    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message || "update failed");
    },

    onSuccess: (data: { liked: boolean; userId: string; blogId: string }) => {
      toast.success("Blog updated successfully");

      queryClient.setQueryData(
        ["client", "blogs", data.blogId],
        (
          oldBlog:
            | (FetchedBlogByClient & { relatedBlogs: FetchedBlogByClient[] })
            | undefined
        ) => {
          if (!oldBlog) return oldBlog;

          const isLiked = data.liked;

          return {
            ...oldBlog,
            likes: isLiked
              ? [
                  ...oldBlog.likes,
                  { userId: data.userId, name: "", profile_image: "" },
                ]
              : oldBlog.likes.filter((user) => user.userId !== data.userId),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}
