import { UserProfile } from "./Usertypes";

export interface DocumentItem {
  name: string;
  type: string;
  url: string;
}

export type CaseDocumentType = {
  id: string;
  caseId: string;
  uploadedBy: string;
  document: DocumentItem;
  createdAt: string;
  updatedAt: string;
};

export interface CaseDocumentDetailedType
  extends Omit<CaseDocumentType, "uploadedBy"> {
  uploaderDetails: UserProfile & { role: string };
}

export interface CaseDocumentsResponseWithPagination {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: CaseDocumentDetailedType[] | [];
}

export type FetchCasesDocumentsByCaseQueryType = {
  search: string;
  page: number;
  limit: number;
  sortOrder: "asc" | "desc";
  caseId: string;
  sort: "date" | "size" | "name";
  uploadedBy: "lawyer" | "client";
};
