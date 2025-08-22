// import { useAppDispatch, useAppSelector } from "@/Redux/Hook";
import { validateAddressFields } from "@/utils/validations/ProfileFormValidation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
// import { useFetchClientData } from "@/hooks/tanstack/queries";
import { fetchClientDataType } from "@/types/types/Client.data.type";
import { useUpdateAddressMutation } from "@/store/tanstack/mutations";

function AddressInfoForm({
  data,
  isLoading,
}: {
  data: fetchClientDataType | undefined;
  isLoading: boolean;
}) {
  // const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { isPending, mutateAsync } = useUpdateAddressMutation();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    state: data?.address?.state || "",
    city: data?.address?.city || "",
    locality: data?.address?.locality || "",
    pincode: data?.address?.pincode || "",
  });

  useEffect(() => {
    if (data) {
      setAddress({
        state: data.address?.state || "",
        city: data.address?.city || "",
        locality: data.address?.locality || "",
        pincode: data.address?.pincode || "",
      });
      // console.log("address fetche", address);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { name, value } = e.target;

    setAddress((prev) => ({ ...prev, [name]: value }));
    const validationError = validateAddressFields(name, value);
    // console.log(validationError);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  const handleUpdateAddress = async () => {
    try {
      await mutateAsync(address);
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setIsEditingAddress(false);
    }
  };

  const FieldSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  );

  return (
    <div className="bg-neutral-300 dark:bg-slate-800 shadow-lg rounded-lg p-6 w-full dark:shadow-black">
      <div className="flex justify-between items-center mb-4">
        {isLoading || isPending ? (
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
        <div>
          {isLoading ? (
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

        <div>
          {isLoading ? (
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

        <div>
          {isLoading || isPending ? (
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

        <div>
          {isLoading || isPending ? (
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

      {isEditingAddress && (
        <div className="mt-6 flex justify-end">
          {isLoading ? (
            <Skeleton className="h-10 w-32 rounded" />
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-blue-400"
              onClick={handleUpdateAddress}
              disabled={typeof isLoading === "boolean" ? isLoading : false}
            >
              {isLoading ? "Updating..." : "Update Address"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AddressInfoForm;
