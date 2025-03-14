import { FcGoogle } from "react-icons/fc";
import { UserEnum } from "../types/enums/user.enums";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextPovider";
import { useNavigate } from "react-router-dom";

function LoginComponent() {
const navigate = useNavigate()
const {setUserRole,userRole}  = useContext(AuthContext)

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFF2F2] dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Tabs */}
        <div className="flex justify-between mb-6 border-b pb-2">
          <button
            onClick={() => setUserRole(UserEnum.client)}
            className={`text-lg font-semibold pb-2 transition-all ${
              userRole === "client"
                ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            Client Login
          </button>
          <button
            onClick={() => setUserRole(UserEnum.lawyer)}
            className={`text-lg font-semibold pb-2 transition-all ${
              userRole === "lawyer"
                ? "border-b-2 border-green-500 text-green-500 dark:text-green-400"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            Lawyer Login
          </button>
        </div>
        {/* Heading */}
        <h2 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-4">
          Login as {userRole}
        </h2>

        {/* Form */}
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              required
            />
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
            onClick={()=>navigate('/signup')}
            className="text-blue-500 dark:text-blue-400 hover:underline">
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
