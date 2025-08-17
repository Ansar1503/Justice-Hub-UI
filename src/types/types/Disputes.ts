import { ChatMessageOutputDto } from "./ChatType";

export interface Disputes {
  id: string;
  disputeType: "reviews" | "messages";
  contentId: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  profile_image: string;
}

export type ChatDisputesData = Omit<
  Disputes,
  "contentId" | "reportedBy" | "reportedUser"
> & {
  reportedBy: UserProfile;
  reportedUser: UserProfile;
  chatMessage: Omit<ChatMessageOutputDto, "senderId" | "receiverId">;
};

export interface FetchChatDisputesResponseDto {
  data: ChatDisputesData[] | [];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}
