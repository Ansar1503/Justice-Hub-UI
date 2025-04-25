// import { useState } from "react";
import BasicInfoForm from "../forms/BasicInfoForm";
import PersonalInfoForm from "../forms/PersonalInfoForm";
import AddressInfoForm from "../forms/AddressInfoForm";
import { useFetchClientData } from "@/hooks/tanstack/queries";
import { VerificationModal } from "../Modals/Verification.Modal";

function ProfileCard() {
  // const userData = useAppSelector((state) => state.Auth.user);
  // console.log("loading", loading);
  // const [successMessage, setSuccessMessage] = useState("");
  const { data, isLoading } = useFetchClientData();
  // console.log("data fetched", data);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Success Message
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )} */}

      {data && data.data?.isVerified === false && <VerificationModal />}

      <BasicInfoForm data={data?.data} isLoading={isLoading} />

      <PersonalInfoForm data={data?.data} isLoading={isLoading} />

      <AddressInfoForm data={data?.data} isLoading={isLoading} />
    </div>
  );
}

export default ProfileCard;
