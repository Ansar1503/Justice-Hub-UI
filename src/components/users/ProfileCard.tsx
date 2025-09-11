import BasicInfoForm from "./forms/BasicInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import AddressInfoForm from "./forms/AddressInfoForm";
import { useFetchClientData } from "@/store/tanstack/queries";
import { AlertDestructive } from "../ui/custom/AlertDestructive";
import { ButtonLink } from "../ui/custom/ButtonLink";
import {
  setLawyerData,
  setProfileImage,
  signOut,
} from "@/store/redux/auth/Auth.Slice";
import { Briefcase, Lock, TriangleAlert, User } from "lucide-react";
import { useContext, useEffect } from "react";
import { LawyerVerificationContext } from "@/context/LawyerVerificationContext";
import { useAppDispatch, useAppSelector } from "@/store/redux/Hook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LawyerVerificationDetails from "../Lawyer/LawyerVerificationComponent";
import { LawyerProfessionalDetailsForm } from "../Lawyer/ProfessionalDetailsComponent";

function ProfileCard() {
  const verificationContext = useContext(LawyerVerificationContext);
  const { user } = useAppSelector((state) => state.Auth);
  const { data, isLoading } = useFetchClientData();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (
      user?.role === "lawyer" &&
      ((!isLoading && !data?.lawyerVerfication) ||
        data?.lawyerVerfication == "pending" ||
        data?.lawyerVerfication === "rejected")
    ) {
      verificationContext?.openModal();
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !data) {
      dispatch(signOut());
    }
  }, [data, isLoading, dispatch]);

  useEffect(() => {
    if (data?.profile_image) {
      dispatch(setProfileImage(data.profile_image));
    }
  }, [data?.profile_image, dispatch]);

  useEffect(() => {
    if (data?.lawyerVerfication) {
      dispatch(
        setLawyerData({
          rejectReason: data?.rejectReason || "",
          verification_status: data.lawyerVerfication,
        })
      );
    }
  }, [data?.lawyerVerfication, data?.rejectReason, dispatch]);
  return (
    <>
      {/* Verification Status Messages */}
      {data?.lawyerVerfication === "pending" ? (
        <div className="flex items-center justify-center font-bold text-red-600 mb-4">
          <TriangleAlert className="mr-2" />
          Lawyer Verification Pending. please goto the profile to verify your
          account.
        </div>
      ) : data?.lawyerVerfication === "rejected" ? (
        <div className="flex items-center justify-center font-bold text-red-600 mb-4">
          <TriangleAlert className="mr-2" />
          Lawyer Verification Rejected. try verification again.
        </div>
      ) : data?.lawyerVerfication === "requested" ? (
        <div className="flex items-center justify-center font-bold text-yellow-600 mb-4">
          <TriangleAlert className="mr-2" />
          Your Verification Request is Under Review. Wait until the admin
          verifies your lawyer account.
        </div>
      ) : null}

      <div className="w-full">
        {/* Alert Messages */}
        {data &&
          ((user?.role === "lawyer" &&
            !isLoading &&
            !data?.lawyerVerfication) ||
            data?.lawyerVerfication === "pending") && (
            <div className="flex border rounded-lg mb-6 border-yellow-600">
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

        {data && data?.lawyerVerfication === "rejected" && (
          <div className="flex items-center border rounded-lg mb-6 border-red-600 p-4">
            <AlertDestructive
              message={`Due to ${data?.rejectReason} your lawyer verification was rejected. Please resubmit your details.`}
              title="Verification Rejected"
            />
            <div className="mt-3 mr-3" onClick={verificationContext?.openModal}>
              <ButtonLink text="Resubmit" />
            </div>
          </div>
        )}

        <Tabs defaultValue="basic-info" className="w-full">
          <TabsList
            className={`grid w-full ${
              user?.role === "lawyer" ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            <TabsTrigger value="basic-info" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger
              value="personal-info"
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Personal Info
            </TabsTrigger>
            {user?.role === "lawyer" && (
              <TabsTrigger
                disabled={user?.role !== "lawyer"}
                value="lawyer-details"
                className="flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Lawyer Details
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="basic-info" className="space-y-6 mt-6">
            <div className="bg-card rounded-lg border p-6">
              <BasicInfoForm data={data} isLoading={isLoading} />
            </div>
            <div className="bg-card rounded-lg border p-6">
              <AddressInfoForm data={data} isLoading={isLoading} />
            </div>
          </TabsContent>

          <TabsContent value="personal-info" className="mt-6">
            <div className="bg-card rounded-lg border p-6">
              <PersonalInfoForm data={data} isLoading={isLoading} />
            </div>
          </TabsContent>

          {user?.role === "lawyer" && (
            <TabsContent value="lawyer-details" className="mt-6">
              <div className="bg-card rounded-lg border p-6">
                <div className="space-y-6">
                  <div>
                    <LawyerProfessionalDetailsForm />
                  </div>
                  <div>
                    <LawyerVerificationDetails />
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
export default ProfileCard;
