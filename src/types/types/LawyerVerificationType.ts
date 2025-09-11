import { VerificationStatus } from "./LawyerTypes";

export interface LawyerVerificationType {
  id: string;
  userId: string;
  barCouncilNumber: string;
  enrollmentCertificateNumber: string;
  certificateOfPracticeNumber: string;
  verificationStatus: VerificationStatus;
  rejectReason?: string;
  documents: {
    id: string;
    userId: string;
    enrollmentCertificate: string;
    certificateOfPractice: string;
    barCouncilCertificate: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}
