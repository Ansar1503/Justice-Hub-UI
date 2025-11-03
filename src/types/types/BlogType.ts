export type BlogComment = {
  userId: string;
  comment: string;
  createdAt: Date;
};

export type BlogType = {
  id: string;
  lawyerId: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  likes: string[];
  comments: BlogComment[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type CreateblogType = {
  title: string;
  content: string;
  coverImage?: File;
  isPublished?: boolean;
};

export type FetchBlogsByLawyerQueryType = {
  page: number;
  limit: number;
  search: string;
  filter: "all" | "published" | "draft";
  sort: "newest" | "oldest" | "title-asc" | "title-desc" | "likes" | "comments";
};

export type FetchBlogsByLawyerResponse = {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: BlogType[];
};

type sortByType = "newest" | "most-liked" | "most-commented";

export type FetchBlogsByClientType = {
  cursor?: number;
  search: string;
  sortBy: sortByType;
};

type UserSummary = {
  userId: string;
  name: string;
  profile_image: string;
};

type LawyerSummary = {
  name: string;
  profile_image: string;
};

type BlogCommentWithUser = {
  userId: string;
  name: string;
  profile_image: string;
  comment: string;
  createdAt: Date | string;
};

export type FetchedBlogByClient = {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  lawyerDetails: LawyerSummary;
  likes: UserSummary[];
  comments: BlogCommentWithUser[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type infiniteFetchBlogsByClient = {
  data: FetchedBlogByClient;
  nextCursor?: number;
};
