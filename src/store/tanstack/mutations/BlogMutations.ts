import { BlogType, CreateblogType } from "@/types/types/BlogType";
import { AddBlog } from "@/utils/api/services/BlogService";
import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddBlogMutation() {\
    const queryClient = useQueryClient()
  return useMutation<BlogType, any, CreateblogType>({
    mutationFn: AddBlog,
    onError: (error) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Blog Adding failed");
    },
    onSettled(){
        queryClient.invalidateQueries({queryKey:["lawyer","blog"]})
    }
  });
}
