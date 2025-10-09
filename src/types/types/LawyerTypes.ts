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

export interface FrontendLawyerDashboard {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  caseGrowthPercent?: number;

  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;

  nextAppointment?: {
    id: string;
    date: string;
    time: string;
    clientId: string;
    clientName: string;
    type: "consultation" | "follow-up";
    status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  };

  recentAppointments?: Array<{
    id: string;
    bookingId: string;
    clientId: string;
    caseId: string;
    amount: number;
    date: string;
    time: string;
    status: string;
    type: string;
  }>;

  totalSessions: number;
  activeSessions: number;
  recentSessions?: Array<{
    id: string;
    appointment_id: string;
    bookingId: string;
    client_id: string;
    caseId: string;
    lawyer_id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    start_time?: string;
    end_time?: string;
    callDuration?: number;
    end_reason?: string;
    follow_up_suggested?: boolean;
    lawyer_joined_at?: string;
    lawyer_left_at?: string;
    room_id?: string;
    summary?: string;
  }>;

  walletBalance: number;
  totalEarnings: number;
  totalCommissionPaid: number;
  earningsGrowthPercent?: number;
  recentTransactions?: Array<{
    id: string;
    amount: number;
    type: "debit" | "credit";
    description: string;
    category: string;
    status: string;
    createdAt: string;
  }>;

  totalReviews: number;
  averageRating: number;
  recentReviews?: Array<{
    id: string;
    heading: string;
    review: string;
    rating: number;
    clientId: string;
    sessionId: string;
    createdAt: string;
  }>;

  recentCases?: Array<{
    id: string;
    title: string;
    clientId: string;
    status: string;
    summary?: string;
    caseType: string;
    createdAt: string;
  }>;
}
