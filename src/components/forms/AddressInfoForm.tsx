import { useAppDispatch, useAppSelector } from "@/Redux/Hook";
import { ValidateProfileFields } from "@/utils/validations/ProfileFormValidation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

function AddressInfoForm() {
  const { client: clientData, loading } = useAppSelector(
    (state) => state.Client
  );
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    state: clientData?.address?.state || "",
    city: clientData?.address?.city || "",
    locality: clientData?.address?.locality || "",
    pincode: clientData?.address?.pincode || "",
  });

  useEffect(() => {
    if (clientData) {
      setAddress({
        state: clientData.address?.state || "",
        city: clientData.address?.city || "",
        locality: clientData.address?.locality || "",
        pincode: clientData.address?.pincode || "",
      });
    }
  }, [clientData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { name, value } = e.target;

    setAddress((prev) => ({ ...prev, [name]: value }));

    const validationError = ValidateProfileFields(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  const handleUpdateAddress = async () => {
    // if (!validateForm("address")) return;
    try {
      console.log("Updating address:", address);
      //   setSuccessMessage("Address updated successfully!");
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      //   setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Reusable field skeleton component
  const FieldSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  );

  return (
    <div className="bg-neutral-300 dark:bg-slate-800 shadow-lg rounded-lg p-6 w-full dark:shadow-black">
      <div className="flex justify-between items-center mb-4">
        {loading ? (
          <>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-6 w-16" />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Address Information
            </h2>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-blue-600 hover:underline"
            >
              {isEditingAddress ? "Cancel" : "Edit"}
            </button>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Locality Field */}
        <div>
          {loading ? (
            <FieldSkeleton />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* City Field */}
        <div>
          {loading ? (
            <FieldSkeleton />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* State Field */}
        <div>
          {loading ? (
            <FieldSkeleton />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Pincode Field */}
        <div>
          {loading ? (
            <FieldSkeleton />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Update Button */}
      {isEditingAddress && (
        <div className="mt-6 flex justify-end">
          {loading ? (
            <Skeleton className="h-10 w-32 rounded" />
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-blue-400"
              onClick={handleUpdateAddress}
              disabled={typeof loading === "boolean" ? loading : false}
            >
              {loading ? "Updating..." : "Update Address"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AddressInfoForm;
  