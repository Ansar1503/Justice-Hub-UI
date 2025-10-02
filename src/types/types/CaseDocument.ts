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
