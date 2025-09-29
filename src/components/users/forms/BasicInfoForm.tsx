import React, { useEffect, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { CircleUser } from "lucide-react";
import { ValidateProfileFields } from "@/utils/validations/ProfileFormValidation";

import { fetchClientDataType } from "@/types/types/Client.data.type";
import { useBasicInfoUpdateMutation } from "@/store/tanstack/mutations";
import { useAppDispatch } from "@/store/redux/Hook";
import { setProfileImage, setUser } from "@/store/redux/auth/Auth.Slice";
import { useProfileBlobImage } from "@/hooks/useProfileBlobImage";

function BasicInfoForm({
  data,
  isLoading,
  profileImage,
}: {
  data: fetchClientDataType | undefined;
  isLoading: boolean;
  profileImage: string | undefined;
}) {
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const dispatch = useAppDispatch();
  // const { client: clientData, loading } = useAppSelector(
  //   (state) => state.Client
  // );
  // console.log(";datatasd", data);
  const { isPending: basicLoading, mutateAsync } = useBasicInfoUpdateMutation();

  console.log("profile image", profileImage);
  const { blobUrl } = useProfileBlobImage({ profileImage });
  // const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [BasicInfo, setBasicInfo] = useState({
    name: data?.name || "",
    mobile: data?.mobile || "",
    image: blobUrl || "",
    dob: data?.dob || "",
    gender: data?.gender || "",
  });
  // console.log("basic loading", basicLoading);
  useEffect(() => {
    if (data) {
      setBasicInfo({
        dob: data?.dob || "",
        gender: data?.gender || "",
        image: blobUrl || "",
        mobile: data?.mobile || "",
        name: data?.name || "",
      });
    }
    if (blobUrl) {
      dispatch(setProfileImage(blobUrl));
    }
  }, [data, blobUrl]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const { name, value } = e.target;
    // console.log(value);

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];

      if (file) {
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        const maxSize = 5 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            image: "Only JPEG, PNG, and WEBP files are allowed",
          }));
          return;
        }

        if (file.size > maxSize) {
          setErrors((prev) => ({
            ...prev,
            image: "Image size should not exceed 5MB",
          }));
          return;
        }

        setBasicInfo((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    } else {
      setBasicInfo((prev) => ({ ...prev, [name]: value }));
    }
    const validationError = ValidateProfileFields(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  async function handleBasicInfoUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    // console.log("basic info submit working... ");
    const form = e.currentTarget;
    const formData = new FormData();
    const fileInput = form.elements.namedItem("image") as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }
    if (!BasicInfo.name) {
      setErrors((prev) => ({
        ...prev,
        name: "name is required",
      }));
      return;
    }
    formData.append("name", BasicInfo?.name || "");
    formData.append("mobile", BasicInfo?.mobile || "");
    formData.append("dob", BasicInfo?.dob || "");
    formData.append("gender", BasicInfo?.gender || "");
    const data = await mutateAsync(formData);
    dispatch(setUser(data));
    // dispatch(updateBasicInfo(formData));
    setIsEditingBasic(false);
  }

  const FieldSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  );

  return (
    <>
      <form
        onSubmit={handleBasicInfoUpdate}
        className="bg-neutral-300 dark:bg-slate-800 shadow-lg dark:shadow-black rounded-lg p-6 w-full"
      >
        <div className="flex justify-between items-center mb-4">
          {basicLoading || isLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Basic Information
            </h2>
          )}

          {basicLoading || isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditingBasic(!isEditingBasic);
              }}
              className="text-blue-600 hover:underline"
            >
              {isEditingBasic ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {basicLoading || isLoading ? (
              <div className="flex flex-col items-center">
                <Skeleton className="w-24 h-24 rounded-full" />
              </div>
            ) : BasicInfo.image ? (
              <img
                src={BasicInfo.image}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
              />
            ) : (
              <CircleUser className="w-20 h-20" />
            )}
            {isEditingBasic && (!basicLoading || !isLoading) && (
              <>
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Name & Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Name Field */}
            <div>
              {basicLoading || isLoading ? (
                <FieldSkeleton />
              ) : (
                <>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    disabled={!isEditingBasic}
                    value={BasicInfo?.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors?.name}</p>
                  )}
                </>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              {basicLoading || isLoading ? (
                <FieldSkeleton />
              ) : (
                <>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    disabled={!isEditingBasic}
                    value={BasicInfo.mobile}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </>
              )}
            </div>

            {/* Date of Birth Field */}
            <div>
              {basicLoading || isLoading ? (
                <FieldSkeleton />
              ) : (
                <>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    disabled={!isEditingBasic}
                    value={BasicInfo.dob}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
                </>
              )}
            </div>

            {/* Gender Field */}
            <div>
              {basicLoading || isLoading ? (
                <FieldSkeleton />
              ) : (
                <>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={BasicInfo.gender}
                    disabled={!isEditingBasic}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditingBasic && (
          <div className="mt-4 flex justify-end">
            {basicLoading || isLoading ? (
              <Skeleton className="h-10 w-32 rounded" />
            ) : (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                disabled={isLoading || basicLoading}
                type="submit"
              >
                {basicLoading || isLoading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        )}
      </form>
    </>
  );
}

export default BasicInfoForm;
