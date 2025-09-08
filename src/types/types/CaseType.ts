export interface CaseTypestype {
  id: string;
  name: string;
  practiceareaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseTypeFetchQuery {
  page: number;
  limit: number;
  search: string;
  pid: string;
}

export interface CaseTypeResponseWithPagination {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: CaseTypestype[] | [];
}
