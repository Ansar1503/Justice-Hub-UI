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
  createdAt: Date;
  updatedAt: Date;
};

export type CreateblogType = {
  title: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
};
