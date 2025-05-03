// import { useState } from "react";
import BasicInfoForm from "./forms/BasicInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import AddressInfoForm from "./forms/AddressInfoForm";
import { useFetchClientData } from "@/store/tanstack/queries";
import { AlertVerificationModal } from "../Lawyer/Modals/AlertVerification";
import { AlertDestructive } from "../ui/custom/AlertDestructive";
import { ButtonLink } from "../ui/custom/ButtonLink";
import { useState } from "react";
import LawyerVerificationFormModal from "../Lawyer/Modals/LawyerVerificationFormModal";

function ProfileCard() {
  // const userData = useAppSelector((state) => state.Auth.user);
  // console.log("loading", loading);
  // const [successMessage, setSuccessMessage] = useState("");
  const { data, isLoading } = useFetchClientData();
  const [verificationForm, setVerificationForm] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Success Message
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )} */}
      {verificationForm && (
        <LawyerVerificationFormModal
          setVerificationModalOpen={setVerificationForm}
        />
      )}

      {data && data.data?.lawyerVerfication === "pending" && (
        <AlertVerificationModal setVerificationForm={setVerificationForm} />
      )}

      {data && data.data?.lawyerVerfication === "pending" && (
        <div className="flex border rounded-lg mb-3  border-yellow-600">
          <AlertDestructive
            message="you profile is not completed, please complete your profile"
            title="Complete your Profile"
          />
          <div
            className="mt-3 mr-2"
            onClick={() => setVerificationForm(true)}
          >
            <ButtonLink text="Complete Now" />
          </div>
        </div>
      )}
      {data && data.data?.lawyerVerfication === "rejected" && (
        <div className="flex items-center border rounded-lg mb-3 border-red-600 p-4">
          <AlertDestructive
            message="Your lawyer verification was rejected. Please resubmit your details."
            title="Verification Rejected"
          />
          <div
            className="mt-3 mr-3"
            onClick={() => setVerificationForm(true)}
          >
            <ButtonLink text="Resubmit" />
          </div>
        </div>
      )}
      <BasicInfoForm data={data?.data} isLoading={isLoading} />

      <PersonalInfoForm data={data?.data} isLoading={isLoading} />

      <AddressInfoForm data={data?.data} isLoading={isLoading} />
    </div>
  );
}

export default ProfileCard;
