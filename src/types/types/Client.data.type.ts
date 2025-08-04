import { Gender, UserEnum } from "../enums/user.enums";

export type userDataType = {
  user_id?: string;
  name: string;
  email: string;
  profile_image?: string;
  mobile?: string;
  password?: string;
  role?: UserEnum;
  is_verified: boolean;
  is_blocked: boolean;
};

export type clientDataType = {
  user_id?: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  profile_image?: string;
  is_verified?: boolean;
  dob?: string;
  address?: AddressType;
  role?: UserEnum;
  gender?: Gender;
  is_blocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

interface LawyerDocuments {
  user_id: string;
  enrollment_certificate: string;
  certificate_of_practice: string;
  bar_council_certificate: string;
}
export interface LawerDataType extends clientDataType {
  user_id: string;
  description?: string;
  barcouncil_number: string;
  enrollment_certificate_number: string;
  certificate_of_practice_number: string;
  verification_status: "verified" | "rejected" | "pending" | "requested";
  practice_areas: string[];
  experience: number;
  specialisation: string[];
  consultation_fee: number;
  documents: LawyerDocuments;
}

export type AddressType = {
  state?: string;
  city?: string;
  locality?: string;
  pincode?: string;
};

export type VerificationStatus =
  | "verified"
  | "rejected"
  | "pending"
  | "requested";

export interface LawyerFilterParams {
  search: string;
  practiceAreas?: string[];
  specialisation?: string[];
  experienceMin: number;
  experienceMax: number;
  feeMin: number;
  feeMax: number;
  sortBy: "rating" | "experience" | "fee-low" | "fee-high";
  page?: number;
  limit?: number;
}
