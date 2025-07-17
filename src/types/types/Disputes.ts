export interface Disputes {
  _id: string;
  disputeType: "reviews" | "messages";
  contentId: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
}
