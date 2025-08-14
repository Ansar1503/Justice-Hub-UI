export interface Review {
  id: string;
  review: string;
  session_id: string;
  heading: string;
  rating: number;
  client_id: string;
  lawyer_id: string;
  createdAt: Date;
  updatedAt: Date;
}
