import BasicInfoForm from "./forms/BasicInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import AddressInfoForm from "./forms/AddressInfoForm";
import { useFetchClientData } from "@/store/tanstack/queries";
import { AlertDestructive } from "../ui/custom/AlertDestructive";
import { ButtonLink } from "../ui/custom/ButtonLink";
import { store } from "@/store/redux/store";
import {
  setLawyerData,
  setProfileImage,
  signOut,
} from "@/store/redux/auth/Auth.Slice";
import { TriangleAlert } from "lucide-react";
import { useContext, useEffect } from "react";
import { LawyerVerificationContext } from "@/context/LawyerVerificationContext";
import { useAppSelector } from "@/store/redux/Hook";

function ProfileCard() {
  const verificationContext = useContext(LawyerVerificationContext);
  const { user } = useAppSelector((state) => state.Auth);
  const { data, isLoading } = useFetchClientData();

  useEffect(() => {
    if (
      user?.role === "lawyer" &&
      (!data?.lawyerVerfication || data?.lawyerVerfication !== "verified")
    ) {
      verificationContext?.openModal();
    }
  }, []);

  if (!data && !isLoading) {
    store.dispatch(signOut());
    // store.dispatch(LogOut());
  }
  if (data && data?.profile_image) {
    store.dispatch(setProfileImage(data?.profile_image));
  }
  if (data && data?.lawyerVerfication) {
    store.dispatch(
      setLawyerData({
        rejectReason: data?.rejectReason || "",
        verification_status: data.lawyerVerfication,
      })
    );
  }
  return (
    <>
      {data?.lawyerVerfication === "pending" ? (
        <div className="flex items-center justify-center  font-bold text-red-600">
          <TriangleAlert />
          Lawyer Verification Pending. please goto the profile to verify your
          account.
        </div>
      ) : data?.lawyerVerfication === "rejected" ? (
        <div className="flex items-center justify-center font-bold text-red-600">
          <TriangleAlert />
          Lawyer Verification Rejected. try verification again.
        </div>
      ) : data?.lawyerVerfication === "requested" ? (
        <div className="flex items-center justify-center  font-bold text-yellow-600">
          <TriangleAlert />
          Your Verification Request is Under Review. Wait until the admin
          verifies your lawyer account.
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col gap-6 w-full">
        {user?.role === "lawyer" &&
          (!data?.lawyerVerfication ||
            data?.lawyerVerfication === "pending") && (
            <div className="flex border rounded-lg mb-3 border-yellow-600">
              <AlertDestructive
                message="Your profile is not completed, please complete your profile"
                title="Complete your Profile"
              />
              <div
                className="mt-3 mr-2"
                onClick={verificationContext?.openModal}
              >
                <ButtonLink text="Complete Now" />
              </div>
            </div>
          )}

        {user?.role === "lawyer" &&
          data &&
          data?.lawyerVerfication === "rejected" && (
            <div className="flex items-center border rounded-lg mb-3 border-red-600 p-4">
              <AlertDestructive
                message={`Due to ${data?.rejectReason} your lawyer verification was rejected. Please resubmit your details.`}
                title="Verification Rejected"
              />
              <div
                className="mt-3 mr-3"
                onClick={verificationContext?.openModal}
              >
                <ButtonLink text="Resubmit" />
              </div>
            </div>
          )}

        <BasicInfoForm data={data} isLoading={isLoading} />
        <PersonalInfoForm data={data} isLoading={isLoading} />
        <AddressInfoForm data={data} isLoading={isLoading} />
      </div>
    </>
  );
}
export default ProfileCard;
