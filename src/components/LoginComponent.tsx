import { useAppDispatch } from "@/Redux/Hook";
import { setUser } from "@/Redux/Auth/Auth.Slice";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { validateSigninField } from "@/utils/validations/SigninFormValidation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginComponent() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [validation, setValidation] = useState<Record<string, string>>({});
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setValidation((prev) => ({
      ...prev,
      [name]: validateSigninField(name, value),
    }));
  }
  const dispatch = useAppDispatch();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const errors: Record<string, string> = {};
    (Object.keys(loginData) as Array<keyof typeof loginData>).forEach(
      (field) => {
        const errorMessage = validateSigninField(field, loginData[field]);
        if (errorMessage) {
          errors[field] = errorMessage;
        }
      }
    );
    setValidation(errors);
    if (Object.keys(errors).length <= 0) {
      try {
        const postData = {
          email: loginData.email,
          password: loginData.password,
        };
        const response = await axiosinstance.post(`/api/user/login`, postData);
        console.log(response.data);
        const userdata = {
          ...response.data?.user,
          token: response.data?.token,
        };
        dispatch(setUser(userdata));
        navigate("/")
      } catch (error: any) {
        if (error.code === "ERR_NETWORK") {
          toast.error(error.message);
        } else if (error.response) {
          if (error.response.data) {
            toast.error(error.response.data?.message);
          }
        }
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFF2F2] dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-4">
          User Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleInput}
              value={loginData.email}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              required
            />
            {validation?.email && (
              <p className="text-red-500 text-sm">{validation.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleInput}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              required
            />
            {validation?.password && (
              <p className="text-red-500 text-sm">{validation.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 dark:bg-black text-white bg-blue-600 hover:bg-blue-500 dark:hover:bg-gray-800 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400">OR</span>
          <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition">
          <FcGoogle size={20} />
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Sign in with Google
          </span>
        </button>

        {/* Bottom Links */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              Sign up
            </button>
          </p>
          <p className="mt-2">
            <button className="text-red-500 dark:text-red-400 hover:underline">
              Forgot Password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
