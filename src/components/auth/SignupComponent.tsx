import { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { UserEnum } from "../../types/enums/user.enums";
import { AuthContext } from "../../context/AuthContextPovider";
import { useLocation, useNavigate } from "react-router-dom";
import { validateSignupField } from "../../utils/validations/SignupFormValidation";
import axiosinstance from "../../utils/api/axios/axios.instance";
import { toast } from "sonner";
// import { useGoogleLogin } from "@react-oauth/google";
// import { Button } from "../ui/button";
// import { useGoogleSignupMutation } from "@/store/tanstack/mutations";

function SignupComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserRole, userRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
    role: userRole,
  });
  let Role: UserEnum;
  if (location.state) {
    const { role } = location.state as { role: UserEnum };
    Role = role;
  }
  useEffect(() => {
    setSignupData((prev) => ({
      ...prev,
      role: Role ? Role : userRole,
    }));
  }, [userRole]);

  const [validation, setValidation] = useState<Record<string, string>>({});
  // const { mutateAsync } = useGoogleSignupMutation();

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setSignupData((prev) => ({ ...prev, [name]: value }));

    setValidation((prev) => ({
      ...prev,
      [name]: validateSignupField(name, value, signupData.password),
    }));
  }

  // const googleSign = useGoogleLogin({
  //   flow: "auth-code",
  //   onSuccess: async (res) => {
  //     await mutateAsync({
  //       code: res.code,
  //       role: userRole === UserEnum.lawyer ? "lawyer" : "client",
  //     });
  //   },
  // });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const errors: Record<string, string> = {};
    (Object.keys(signupData) as Array<keyof typeof signupData>).forEach(
      (field) => {
        const errorMessage = validateSignupField(
          field,
          signupData[field],
          signupData.password
        );
        if (errorMessage) {
          errors[field] = errorMessage;
        }
      }
    );

    setValidation(errors);
    if (Object.keys(errors).length <= 0) {
      try {
        const postData = {
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
          mobile: signupData.mobile,
        };
        setLoading(true);
        const response = await axiosinstance.post(`/api/user/signup`, postData);
        navigate(`/otp?email=${response.data?.email}`);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.log(error);
        if (error.code === "ERR_NETWORK") {
          toast.error(error.message);
        } else if (error.response) {
          if (error.response.data) {
            setError(error.response.data?.error);
          }
        }
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFF2F2] dark:bg-gray-900 ">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mt-10 mb-10">
        {/* Toggle Switch */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 bg-gray-200 dark:bg-gray-700 p-1 rounded-full flex">
            <button
              onClick={() => setUserRole(UserEnum.client)}
              className={classNames(
                "w-1/2 py-2 text-center text-sm font-semibold rounded-full transition-all",
                userRole === UserEnum.client
                  ? "bg-blue-500 text-white dark:bg-blue-400"
                  : "text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              )}
            >
              Client
            </button>
            <button
              onClick={() => setUserRole(UserEnum.lawyer)}
              className={classNames(
                "w-1/2 py-2 text-center text-sm font-semibold rounded-full transition-all",
                userRole === UserEnum.lawyer
                  ? "bg-green-500 text-white dark:bg-green-400"
                  : "text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              )}
            >
              Lawyer
            </button>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-4">
          Signup as {userRole === UserEnum.client ? "Client" : "Lawyer"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Name
            </label>
            <input
              onChange={handleInput}
              type="text"
              name="name"
              value={signupData.name}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
            {validation?.name && (
              <p className="text-red-500 text-sm">{validation.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Email Address
            </label>
            <input
              onChange={handleInput}
              type="email"
              name="email"
              value={signupData.email}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
            {validation.email && (
              <p className="text-red-500 text-sm">{validation.email}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Mobile Number
            </label>
            <input
              onChange={handleInput}
              type="tel"
              name="mobile"
              value={signupData.mobile}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
            {validation.mobile && (
              <p className="text-red-500 text-sm">{validation.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Password
            </label>
            <input
              onChange={handleInput}
              type="password"
              name="password"
              value={signupData.password}
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
            {validation.password && (
              <p className="text-red-500 text-sm">{validation.password}</p>
            )}
          </div>

          {/* confirm password */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              confirm password
            </label>
            <input
              onChange={handleInput}
              type="password"
              name="cpassword"
              value={signupData.cpassword}
              placeholder="confirm password"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
            {validation.cpassword && (
              <p className="text-red-500 text-sm">{validation.cpassword}</p>
            )}
          </div>

          {/* Signup Button with Loading Animation */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-2 mt-4 text-white dark:bg-black bg-blue-600 hover:bg-blue-500 dark:hover:bg-gray-800 rounded-lg transition overflow-hidden"
          >
            {loading ? "Signing Up..." : "Sign Up"}
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
          <span className="text-red-800">{error}</span>
        </form>

        {/* Google Signup */}
        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400">OR</span>
          <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
        </div>

        {/* <GoogleLogin
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
        /> */}
        {/* <Button
          // onClick={() => googleSign()}
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2 shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </Button> */}

        {/* Bottom Links */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupComponent;
