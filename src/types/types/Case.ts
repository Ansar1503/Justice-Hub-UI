import { CaseTypestype } from "./CaseType";
import { sortOrderType } from "./CommonTypes";
import { UserProfile } from "./Usertypes";

export type sortByType = "date" | "title" | "client" | "lawyer";
export type statusType = "open" | "closed" | "onhold" | "All";
type StatusType = "open" | "closed" | "onhold";

export type Casetype = {
  id: string;
  title: string;
  clientId: string;
  lawyerId: string;
  caseType: string;
  summary?: string;
  estimatedValue?: number;
  nextHearing?: Date;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateCaseDetailsType = {
  title: string;
  caseId: string
  summary: string;
  status: StatusType;
  estimatedValue: number
  nextHearing?: string
}

export type FetchCaseQueryType = {
  page: number;
  limit: number;
  search: string;
  sortOrder: sortOrderType;
  sortBy: sortByType;
  status: statusType;
  caseTypeFilter: string;
};

export type AggregatedCasesData = {
  id: string;
  title: string;
  lawyerDetails: UserProfile;
  clientDetails: UserProfile;
  caseTypeDetails: Omit<
    CaseTypestype,
    "createdAt" | "updatedAt" | "practiceareaId"
  >;
  summary?: string;
  estimatedValue?: number;
  nextHearing?: Date;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
};

export type CaseQueryResponseType = {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: AggregatedCasesData[] | [];
};
