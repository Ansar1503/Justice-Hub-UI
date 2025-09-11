import { PracticeAreaType } from "./PracticeAreaType";
import { SpecializationsType } from "./SpecializationType";

export interface LawyerProfessionalType {
  id: string;
  userId: string;
  description: string;
  practiceAreas: string[];
  experience: number;
  specialisations: string[];
  consultationFee: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface lawyerProfessionalDetailsResponse {
  id: string;
  userId: string;
  description: string;
  practiceAreas:
    | Omit<PracticeAreaType, "createdAt" | "updatedAt" | "specializationId">[]
    | [];
  experience: number;
  specializations: Omit<SpecializationsType, "createdAt" | "updatedAt">[];
  consultationFee: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
