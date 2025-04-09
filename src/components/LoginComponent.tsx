import { useAppDispatch, useAppSelector } from "@/Redux/Hook";
import { validateSigninField } from "@/utils/validations/SigninFormValidation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { loginUser } from "@/Redux/Auth/Auth.thunk";

function LoginComponent() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const { loading, error, user } = useAppSelector((state) => state.Auth);
  useEffect(() => {
    console.log("user in useeffect", user);
  }, [user]);
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
      const postData = {
        email: loginData.email,
        password: loginData.password,
      };

      const result = await dispatch(loginUser(postData));

      if (loginUser.fulfilled.match(result)) {
        toast.success("login success");
      } else {
        toast.error(
          typeof result.payload === "string" ? result.payload : "Login failed"
        );
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
            disabled={loading}
            className={`relative w-full py-2 mt-4 text-white rounded-lg transition overflow-hidden ${
              loading
                ? "bg-blue-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-700 dark:bg-black hover:bg-blue-500 dark:hover:bg-gray-800"
            }
`}
          >
            {loading ? "Logging In..." : "Login"}

            {loading && (
              <motion.div
                className="absolute bottom-0 left-0 h-[3px] w-full bg-blue-300"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "linear",
                }}
              />
            )}
          </button>
          <div className="text-center mt-2">
            {error && <span className="text-red-500">{error}</span>}
          </div>
        </form>

        {/* Google Sign-In */}
        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400">OR</span>
          <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
        </div>

        <GoogleLogin
          theme="filled_blue"
          shape="pill"
          onSuccess={(credentialResponse) => {
            if (credentialResponse) {
              console.log(credentialResponse);
            }
          }}
          onError={() => {
            console.log("error occured");
          }}
        />

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
