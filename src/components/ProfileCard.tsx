import { useAppSelector } from "@/Redux/Hook";
import { ValidateProfileFields } from "@/utils/validations/ProfileFormValidation";
import { CircleUser, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import axiosinstance from "@/utils/api/axios/axios.instance";

function ProfileCard() {
  const userData = useAppSelector((state) => state.Auth.user);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [newMail, setnewMail] = useState(userData?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [BasicInfo, setBasicInfo] = useState({
    name: userData?.name || "",
    mobile_number: userData?.mobile || "",
    image: userData?.image || "",
    dob: userData?.dob || "",
    gender: userData?.gender || "",
  });

  const [address, setAddress] = useState({
    state: userData?.address?.state || "",
    city: userData?.address?.city || "",
    locality: userData?.address?.locality || "",
    pincode: userData?.address?.pincode || "",
  });

  useEffect(() => {
    if (userData) {
      setBasicInfo((prev) => ({
        ...prev,
        name: userData.name || prev.name,
        mobile_number: userData.mobile || prev.mobile_number,
        image: userData.image || prev.image,
        dob: userData.dob || prev.dob,
        gender: userData.gender || prev.gender,
      }));
      setnewMail((prev) => userData?.email || prev);
      setAddress((prev) => ({
        state: userData.address?.state || prev.state,
        city: userData.address?.city || prev.city,
        locality: userData.address?.locality || prev.locality,
        pincode: userData.address?.pincode || prev.pincode,
      }));
    }
  }, [userData]);

  // handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];

      if (file) {
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
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

        setErrors((prev) => ({ ...prev, image: "" }));
        setBasicInfo((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
      }
    } else {
      if (["state", "city", "locality", "pincode"].includes(name)) {
        setAddress((prev) => ({ ...prev, [name]: value }));
      } else if (["name", "mobile_number", "dob", "gender"].includes(name)) {
        setBasicInfo((prev) => ({ ...prev, [name]: value }));
      } else {
        setnewMail(value);
      }
    }
    const validationError = ValidateProfileFields(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  // valid form
  const validateForm = (
    section: "basic" | "address" | "email" | "password"
  ) => {
    let formIsValid = true;
    const newErrors = { ...errors };

    if (section === "basic") {
      ["name", "dob", "gender"].forEach((field) => {
        const value = BasicInfo[field as keyof typeof BasicInfo];
        const error = ValidateProfileFields(field, value as string);
        if (error) {
          newErrors[field] = error;
          formIsValid = false;
        }
      });
    } else if (section === "address") {
      ["state", "city", "locality", "pincode"].forEach((field) => {
        const value = address[field as keyof typeof address];
        const error = ValidateProfileFields(field, value);
        if (error) {
          newErrors[field] = error;
          formIsValid = false;
        }
      });
    } else if (section === "email") {
      const error = ValidateProfileFields("email", newMail);
      if (error) {
        newErrors.email = error;
        formIsValid = false;
      }
    } else if (section === "password") {
      const error = ValidateProfileFields("password", newPassword);
      if (error) {
        newErrors.password = error;
        formIsValid = false;
      }

      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        formIsValid = false;
      }
    }

    setErrors(newErrors);
    return formIsValid;
  };

  // updating address handling

  const handleUpdateAddress = async () => {
    if (!validateForm("address")) return;

    setLoading(true);
    try {
      console.log("Updating address:", address);
      setSuccessMessage("Address updated successfully!");
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleUpdateEmail = async () => {
    if (!validateForm("email")) return;

    setLoading(true);
    try {
      console.log("Sending verification to:", newMail);
      setSuccessMessage("Verification email sent!");
    } catch (error) {
      console.error("Error updating email:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // password function handling
  const handleUpdatePassword = async () => {
    if (!validateForm("password")) return;

    setLoading(true);
    try {
      setSuccessMessage("Password updated successfully!");
      setEditPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // bbasicInfoSubmit4
  function handleBasicInfoUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log("basic info submit working... ");
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
    formData.append("mobile_number", BasicInfo?.mobile_number || "");
    formData.append("dob", BasicInfo?.dob || "");
    formData.append("gender", BasicInfo?.gender || "");
    
  }
  if (!userData) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <Skeleton className="h-10 w-32 mb-4 rounded" />
        <div className="flex gap-4 items-center mb-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* First Card - Basic Profile Info */}
      <form
        onSubmit={handleBasicInfoUpdate}
        className="bg-neutral-300 dark:bg-slate-800 shadow-lg dark:shadow-black rounded-lg p-6 w-full "
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Basic Information
          </h2>
          <button
            onClick={() => setIsEditingBasic(!isEditingBasic)}
            className="text-blue-600 hover:underline"
          >
            {isEditingBasic ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {BasicInfo.image ? (
              <img
                src={BasicInfo.image}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
              />
            ) : (
              <CircleUser className="w-20 h-20" />
            )}
            {isEditingBasic && (
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
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                disabled={!isEditingBasic}
                value={BasicInfo.name}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="mobile_number"
                disabled={!isEditingBasic}
                value={BasicInfo.mobile_number}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
              />
              {errors.mobile_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile_number}
                </p>
              )}
            </div>
            <div>
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
            </div>
            <div>
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
            </div>
          </div>
        </div>
        {isEditingBasic && (
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
              type="submit"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>

      {/* Personal Information Card */}
      <div className="bg-neutral-300 dark:bg-slate-800 shadow-lg rounded-lg p-6 w-full dark:shadow-black">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Personal Information
        </h2>
        <div className="flex-grow space-y-4 w-full">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Email
            </label>
            <div className="flex items-center gap-2">
              {!editEmail ? (
                <input
                  disabled={!editEmail}
                  type="email"
                  name="email"
                  value={userData?.email || newMail}
                  onChange={handleChange}
                  className="flex-grow p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
                />
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
                onClick={() => {
                  setEditEmail(!editEmail);
                  if (editEmail) {
                    setnewMail(userData?.email || "");
                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                    }));
                  }
                }}
                className="text-blue-600 hover:underline whitespace-nowrap"
              >
                {editEmail ? "Cancel" : "Change Email"}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            {editEmail && (
              <div className="mt-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-blue-400"
                  onClick={handleUpdateEmail}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Verification"}
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <button
                onClick={() => setEditPassword(!editPassword)}
                className="text-blue-600 hover:underline"
              >
                {editPassword ? "Cancel" : "Change Password"}
              </button>
            </div>

            {!editPassword ? (
              <div className="p-2 border rounded dark:bg-gray-800">
                ••••••••••••
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 pr-10 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setshowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-blue-400"
                    onClick={handleUpdatePassword}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Information Card */}
      <div className="bg-neutral-300 dark:bg-slate-800 shadow-lg rounded-lg p-6 w-full dark:shadow-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Address Information
          </h2>
          <button
            onClick={() => setIsEditingAddress(!isEditingAddress)}
            className="text-blue-600 hover:underline"
          >
            {isEditingAddress ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Locality
            </label>
            <input
              type="text"
              name="locality"
              value={address.locality}
              onChange={handleChange}
              disabled={!isEditingAddress}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
            />
            {errors.locality && (
              <p className="text-red-500 text-sm mt-1">{errors.locality}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              disabled={!isEditingAddress}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleChange}
              disabled={!isEditingAddress}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              disabled={!isEditingAddress}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:dark:bg-gray-800"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
            )}
          </div>
        </div>

        {isEditingAddress && (
          <div className="mt-6 flex justify-end">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-blue-400"
              onClick={handleUpdateAddress}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Address"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
