export interface PracticeAreaType {
  id: string;
  name: string;
  specializationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PracticeAreaResponse {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: PracticeAreaType[] | [];
}

export interface PracticeAreaQuery {
  limit: number;
  page: number;
  search: string;
  specId: string;
}
