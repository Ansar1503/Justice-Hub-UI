export type VerificationStatus =
  | "verified"
  | "rejected"
  | "pending"
  | "requested";
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

interface PracticeArea {
  id: string;
  name: string;
}
interface Specialization {
  id: string;
  name: string;
}

export interface AggregatedLawyerProfile {
  userId: string;
  createdAt: Date | string;
  personalDetails: {
    name: string;
    email: string;
    isVerified: boolean;
    profileImage: string;
    mobile: string;
    address: {
      state: string;
      city: string;
      locality: string;
      pincode: string;
    };
  };

  ProfessionalDetails: {
    description: string;
    practiceAreas: PracticeArea[] | [];
    experience: number;
    specialisations: Specialization[] | [];
    consultationFee: number;
    createdAt: Date | string;
    updatedAt: Date | string;
  };

  verificationDetails: {
    barCouncilNumber: string;
    enrollmentCertificateNumber: string;
    certificateOfPracticeNumber: string;
    verificationStatus: VerificationStatus;
    rejectReason: string | null;
    documents: string[] | [];
    createdAt: Date | string;
    updatedAt: Date | string;
  };

  verificationDocuments: {
    enrollmentCertificate: string;
    certificateOfPractice: string;
    barCouncilCertificate: string;
  };
}

export interface AggregatedLawyerResponseAdminSide {
  lawyers: AggregatedLawyerProfile[] | [];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
