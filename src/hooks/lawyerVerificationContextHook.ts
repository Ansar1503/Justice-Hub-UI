import { useContext } from "react";
import { LawyerVerificationContext } from "@/context/LawyerVerificationContext";

export const useLawyerVerification = () => {
  const context = useContext(LawyerVerificationContext);
  if (!context)
    throw new Error(
      "useLawyerVerification must be used within LawyerVerificationProvider"
    );
  return context;
};
