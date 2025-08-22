export type VerificationStatus = "verified" | "rejected" | "pending" | "requested";
type LawyerDocumentsType = {
  id: string;
  user_id: string;
  enrollment_certificate: string;
  certificate_of_practice: string;
  bar_council_certificate: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FetchLawyerResponseType = {
  id: string;
  user_id: string;
  description: string;
  barcouncil_number: string;
  enrollment_certificate_number: string;
  certificate_of_practice_number: string;
  verification_status: VerificationStatus;
  practice_areas: string[];
  experience: number;
  specialisation: string[];
  consultation_fee: number;
  documents: LawyerDocumentsType;
  rejectReason: string;
  createdAt: Date;
  updatedAt: Date;
};
