// import { useAppDispatch } from "@/Redux/Hook";
import { ValidateProfileFields } from "@/utils/validations/ProfileFormValidation";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { AlertDestructive } from "../ui/custom/AlertDestructive";
import { ButtonLink } from "../ui/custom/ButtonLink";
import { clientDataType } from "@/types/types/Client.data.type";
import { VerifiedBadge } from "../ui/custom/VerifiedBadge";
import {
  usesendVerificationMailMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
} from "@/hooks/tanstack/mutations";

function PersonalInfoForm({
  data,
  isLoading,
}: {
  data: clientDataType;
  isLoading: boolean;
}) {
  // const { client: data, loading } = useAppSelector(
  //   (state) => state.Client
  // );
  // console.log("data", data);
  // const dispatch = useAppDispatch();
  const [showPassword, setshowPassword] = useState(false);
  // const [passwordLoading, setPasswordLoading] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [editPassword, setEditPassword] = useState(false);
  const [newMail, setnewMail] = useState(data?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [formError, setFormError] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { isPending: isUpdatingEmail, mutateAsync: updateEmailAsync } =
    useUpdateEmailMutation();
  const { isPending: isUpdatingPassword, mutateAsync: updatePasswordAsync } =
    useUpdatePasswordMutation();
  // console.log("errormrs", errors);
  const {
    isPending: isSendingVerification,
    mutateAsync: sendVerificationAsync,
  } = usesendVerificationMailMutation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();

    const { name, value } = e.target;

    if (name === "email") {
      setnewMail(value);
    }
    if (name === "password") {
      setNewPassword(value);
    }
    if (name === "cpassword") {
      setConfirmPassword(value);
    }
    if (name === "currentPassword") {
      setCurrentPassword(value);
    }

    const validationError = ValidateProfileFields(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));

    if (
      (name === "password" && confirmPassword) ||
      (name === "cpassword" && newPassword)
    ) {
      const newPass = name === "password" ? value : newPassword;
      const confirmPass = name === "cpassword" ? value : confirmPassword;
      // console.log('new:',newPass,"  confirmed pass:",confirmPass)
      if (newPass !== confirmPass) {
        setErrors((prev) => ({
          ...prev,
          cpassword: "Passwords don't match",
        }));
      }
    }
  }

  // console.log('errors',errors)
  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const form = e.currentTarget;
      const emailInput = form.elements.namedItem("email") as HTMLInputElement;
      const email = emailInput.value;
      await updateEmailAsync({ email });
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, email: error.message }));
    }
  };

  const handleVerifynewEmail = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!data?.email) return;
    try {
      await sendVerificationAsync({ email: data.email });
    } catch (error) {
      console.log("this verify send mail error  resphsne", error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!currentPassword) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is required",
        }));
        return;
      }

      if (!newPassword) {
        setErrors((prev) => ({
          ...prev,
          password: "New password is required",
        }));
        return;
      }

      if (!confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          cpassword: "Confirm password is required",
        }));
        return;
      }

      const errorsExist =
        Object.values(errors).filter((val) => val !== "").length > 0;
      if (errorsExist) return;

      await updatePasswordAsync({
        currentPassword,
        password: newPassword,
      });
      setEditPassword(false);
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const FieldSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24 mb-1" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 flex-grow rounded" />
        <Skeleton className="h-8 w-28 rounded" />
      </div>
    </div>
  );

  return (
    <div className="bg-neutral-300 dark:bg-slate-800 shadow-lg rounded-lg p-6 w-full dark:shadow-black">
      {/* Form Header */}
      {isSendingVerification || isLoading || isUpdatingEmail ? (
        <Skeleton className="h-7 w-56 mb-4" />
      ) : (
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Personal Information
        </h2>
      )}

      <div className="flex-grow space-y-4 w-full">
        {/* Email Section */}
        <form onSubmit={handleUpdateEmail}>
          {isSendingVerification || isLoading || isUpdatingEmail ? (
            <FieldSkeleton />
          ) : (
            <>
              {data && !data?.is_verified && (
                <div className="flex border rounded-lg mb-3  border-yellow-600">
                  <AlertDestructive
                    message="email not verified, please verify your email"
                    title="email not verified"
                  />
                  <div className="mt-3 mr-2" onClick={handleVerifynewEmail}>
                    <ButtonLink text="Verify Now" />
                  </div>
                </div>
              )}
              {data && data.is_verified && (
                <div className="flex justify-end">
                  <VerifiedBadge />
                </div>
              )}
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Email
              </label>
              <div className="flex items-center gap-2">
                {!editEmail ? (
                  <>
                    <input
                      disabled={!editEmail}
                      type="email"
                      name="email"
                      value={data?.email || newMail}
                      onChange={handleChange}
                      className="flex-grow p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
                    />
                  </>
                ) : (
                  <input
                    disabled={!editEmail}
                    type="email"
                    name="email"
                    value={newMail}
                    onChange={handleChange}
                    className="flex-grow p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
                  />
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditEmail(!editEmail);
                    if (editEmail) {
                      setnewMail(data?.email || "");
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }
                  }}
                  className={`text-blue-600 hover:underline whitespace-nowrap disabled:text-gray-400 disabled:cursor-not-allowed`}
                  disabled={data && data.is_verified ? false : true}
                >
                  {editEmail ? "Cancel" : "Change Mail"}
                </button>
              </div>
            </>
          )}

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          {editEmail && (
            <div className="mt-2">
              {isLoading ? (
                <Skeleton className="h-8 w-32 rounded" />
              ) : (
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={
                    isLoading || isUpdatingEmail || isSendingVerification
                  }
                >
                  {isLoading || isUpdatingEmail
                    ? "Sending..."
                    : "Send Verification"}
                </button>
              )}
            </div>
          )}
        </form>

        <div>
          {isLoading || isUpdatingPassword ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                {data && data.is_verified && (
                  <button
                    onClick={() => setEditPassword(!editPassword)}
                    className="text-blue-600 hover:underline"
                  >
                    {editPassword ? "Cancel" : "Change Password"}
                  </button>
                )}
              </div>

              {!editPassword || (data && !data?.is_verified) ? (
                <div className="p-2 border rounded dark:bg-gray-800">
                  ••••••••••••
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="currentPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={handleChange}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={handleChange}
                        className="w-full p-2 pr-10 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setshowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="cpassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="cpassword"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={handleChange}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.cpassword && (
                      <p className="text-red-500 text-sm">{errors.cpassword}</p>
                    )}
                  </div>

                  {/* Update Button */}
                  <div className="pt-2">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpdatePassword();
                      }}
                      disabled={isLoading || isUpdatingPassword}
                    >
                      {isLoading || isUpdatingPassword
                        ? "Updating..."
                        : "Update Password"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {isLoading && editPassword && (
          <div className="space-y-2 mt-2">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-8 w-32 rounded" />
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalInfoForm;
