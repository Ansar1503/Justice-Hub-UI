import { useFetchReviewDisputes } from "@/store/tanstack/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import PaginationComponent from "../pagination";
import { UserDetailsModal } from "./Modals/UserDetails.Modal";
import ReviewDisputeDetailsModal from "@/components/admin/Modals/ReviewDisputeDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { useState } from "react";

type Props = {
  itemsPerPage: number;
  currentPage: number;
  searchTerm: string;
  // status: "pending" | "resolved" | "rejected";
  sortBy: "All" | "review_date" | "reported_date";
  sortOrder: "asc" | "desc";
  setCurrentPage: (p: number) => void;
};

export default function ReviewDisputesTable({
  setCurrentPage,
  currentPage,
  itemsPerPage,
  searchTerm,
  sortBy,
  sortOrder,
}: Props) {
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  const { data: reviewDisputesData } = useFetchReviewDisputes({
    limit: itemsPerPage,
    page: currentPage,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const reviewDisputes = reviewDisputesData?.data || [];
  const totalPages = reviewDisputesData?.totalPage || 1;
  const totalCount = reviewDisputesData?.totalCount || 1;
  console.log("reviewDisputes", reviewDisputes);
  const handleViewDetails = (dispute: any) => {
    setSelectedDispute(dispute);
    setDisputeModalOpen(true);
  };

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
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };
  return (
    <>
      <Table>
        <TableHeader className="bg-stone-600/5 dark:bg-white/10">
          <TableRow>
            <TableHead>Reporter</TableHead>
            <TableHead>Reported User</TableHead>
            <TableHead>Review Content</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Report Reason</TableHead>
            <TableHead>Review Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviewDisputes && reviewDisputes.length > 0 ? (
            reviewDisputes.map((dispute, index) => (
              <TableRow key={(dispute as any)._id || index}>
                {/* Reporter */}
                <TableCell className="p-3 bg-white/5">
                  <UserDetailsModal
                    user={dispute.reportedByuserData}
                    trigger={
                      <div className="flex items-center gap-3 cursor-pointer">
                        <Avatar>
                          {dispute.reportedByuserData.profile_image ? (
                            <AvatarImage
                              className="rounded-full w-10"
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
                            {dispute.reportedByuserData.role || "User"}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </TableCell>

                {/* Reported User */}
                <TableCell className="p-3 bg-white/5">
                  <UserDetailsModal
                    user={dispute.reportedUserData}
                    trigger={
                      <div className="flex items-center gap-3 cursor-pointer">
                        <Avatar>
                          {dispute.reportedUserData.profile_image ? (
                            <AvatarImage
                              className="rounded-full w-10"
                              src={
                                dispute.reportedUserData.profile_image ||
                                "/placeholder.svg"
                              }
                              alt={dispute.reportedUserData.name}
                            />
                          ) : (
                            <AvatarFallback>
                              {dispute.reportedUserData?.name
                                ?.substring(0, 2)
                                ?.toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {dispute.reportedUserData.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {dispute.reportedUserData.role || "User"}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </TableCell>

                {/* Review Content */}
                <TableCell className="p-3 bg-white/5">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {dispute?.contentData?.heading}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {dispute?.contentData?.review}
                    </p>
                  </div>
                </TableCell>

                {/* Rating */}
                <TableCell className="p-3 bg-white/5">
                  {renderStars(dispute?.contentData?.rating)}
                </TableCell>

                {/* Report Reason */}
                <TableCell className="p-3 bg-white/5">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {dispute.reason}
                    </p>
                  </div>
                </TableCell>

                {/* Review Date */}
                <TableCell className="p-3 bg-white/5">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {new Date(
                      dispute?.contentData?.createdAt
                    )?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(
                      dispute?.contentData?.createdAt
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="p-3 bg-white/5">
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
                </TableCell>

                {/* Actions */}
                <TableCell className="p-3 bg-white/5">
                  <div className="flex justify-center gap-2">
                    <Badge
                      className="cursor-pointer hover:bg-blue-200 transition-colors"
                      variant="secondary"
                      onClick={() => handleViewDetails(dispute)}
                    >
                      View Details
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No Review Disputes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <PaginationComponent
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          totalItems={totalCount}
          handlePageChange={setCurrentPage}
        />
      </Table>

      {/* Review Dispute Details Modal */}
      {selectedDispute && (
        <ReviewDisputeDetailsModal
          dispute={selectedDispute}
          open={disputeModalOpen}
          onOpenChange={setDisputeModalOpen}
        />
      )}
    </>
  );
}
