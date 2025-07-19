"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, User, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Review } from "@/types/types/Review";
import { clientDataType, userDataType } from "@/types/types/Client.data.type";
import { Disputes } from "@/types/types/Disputes";
import {
  useBlockUser,
  useDeleteDisputeReview,
} from "@/store/tanstack/mutations";

interface ReviewDisputeDetailsModalProps {
  dispute: {
    contentData: Review;
    reportedByuserData: userDataType & clientDataType;
    reportedUserData: userDataType & clientDataType;
  } & Disputes;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewDisputeDetailsModal({
  dispute,
  open,
  onOpenChange,
}: ReviewDisputeDetailsModalProps) {
  const { mutateAsync: deleteDisputeReview } = useDeleteDisputeReview();
  const { mutateAsync: blockDisputeUser } = useBlockUser();
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  const handleResolveDispute = async (
    action: "dismiss" | "Block" | "delete"
  ) => {
    if (action === "delete") {
      await deleteDisputeReview({
        diputeId: dispute._id,
        reviewId: dispute.contentData._id,
      });
    } else if (action === "Block") {
      await blockDisputeUser(dispute.reportedUser);
    }
  };
  //   console.log("dispute:", dispute);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Review Dispute Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dispute Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge
                variant={
                  dispute.status === "resolved"
                    ? "default"
                    : dispute.status === "rejected"
                    ? "destructive"
                    : "secondary"
                }
                className={
                  dispute.status === "resolved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : dispute.status === "rejected"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }
              >
                {dispute.status.charAt(0).toUpperCase() +
                  dispute.status.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Dispute ID: {dispute._id}
            </div>
          </div>

          <Separator />

          {/* Reporter and Reported User */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reporter */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Reporter
              </h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar>
                  {dispute.reportedByuserData.profile_image ? (
                    <AvatarImage
                      src={
                        dispute.reportedByuserData.profile_image ||
                        "/placeholder.svg"
                      }
                      alt={dispute.reportedByuserData.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {dispute.reportedByuserData.name
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">
                    {dispute.reportedByuserData.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dispute.reportedByuserData.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Role: {dispute.reportedByuserData.role || "User"}
                  </div>
                </div>
              </div>
            </div>

            {/* Reported User */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Reported User
              </h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar>
                  {dispute.reportedUserData.profile_image ? (
                    <AvatarImage
                      src={
                        dispute.reportedUserData.profile_image ||
                        "/placeholder.svg"
                      }
                      alt={dispute.reportedUserData.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {dispute.reportedUserData.name
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">
                    {dispute.reportedUserData.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dispute.reportedUserData.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Role: {dispute.reportedUserData.role || "User"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Review Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reported Review</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-lg">
                  {dispute.contentData.heading}
                </h4>
                {renderStars(dispute.contentData.rating)}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {dispute.contentData.review}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(dispute.contentData.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
                <div>Session ID: {dispute.contentData.session_id}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Report Reason */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Report Reason
            </h3>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{dispute.reason}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {dispute.status === "pending" && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Resolution Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {/* <Button
                    variant="outline"
                    onClick={() => handleResolveDispute("dismiss")}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Dismiss Report
                  </Button> */}
                  <Button
                    variant="outline"
                    onClick={() => handleResolveDispute("Block")}
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    Block User
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleResolveDispute("delete")}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Delete Review
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
