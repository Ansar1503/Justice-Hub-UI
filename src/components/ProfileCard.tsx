import { useAppDispatch, useAppSelector } from "@/Redux/Hook";
import { useState, useEffect } from "react";
import { fetchClientData } from "@/Redux/Client/Client.thunk";
import BasicInfoForm from "./forms/BasicInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import AddressInfoForm from "./forms/AddressInfoForm";

function ProfileCard() {
  const {
    client: clientData,
    loading,
    error,
  } = useAppSelector((state) => state.Client);
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.Auth.user);
  // console.log("loading", loading);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (userData?.user_id && !clientData) {
      console.log("client data fetching .....");
      const result = dispatch(fetchClientData());
      console.log('fetch reust',result)
    }
  }, [userData?.user_id]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <BasicInfoForm />

      <PersonalInfoForm />

      <AddressInfoForm />
    </div>
  );
}

export default ProfileCard;
