export interface SpecializationsType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SpecializationsResponseTypeWithPagination = {
  data: SpecializationsType[] | [];
  totalCount: number;
  currentPage: number;
  totalPage: number;
};

export type FetchSpecializationRequestPayloadType = {
  page: number;
  limit: number;
  search: string;
};
