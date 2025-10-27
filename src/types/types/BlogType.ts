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
