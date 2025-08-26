import { useContext } from "react";
import { LawyerVerificationContext } from "@/context/LawyerVerificationContext";

export const useLawyerVerification = () => {
  const context = useContext(LawyerVerificationContext);
  return context;
};
