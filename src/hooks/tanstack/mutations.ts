import { setToken, setUser } from "@/Redux/Auth/Auth.Slice";
import { useAppDispatch } from "@/Redux/Hook";
import { loginUser } from "@/services/AuthServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    email: string;
    name: string;
    role: string;
    user_id: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // console.log("data", data);
      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["client"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Login failed. Try again.";
      error.message = message;
      toast.error(message);
    },
  });
}
