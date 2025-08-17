"use client";

import { useFetchChatDisputes } from "@/store/tanstack/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import PaginationComponent from "../pagination";
import ChatDisputeDetailsModal from "@/components/admin/Modals/ChatDisputeDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { ChatDisputesData } from "@/types/types/Disputes";
type Props = {
  itemsPerPage: number;
  currentPage: number;
  searchTerm: string;
  sortBy: "message_date" | "reported_date";
  sortOrder: "asc" | "desc";
  setCurrentPage: (p: number) => void;
};

export default function ChatDisputesTable({
  setCurrentPage,
  currentPage,
  itemsPerPage,
  searchTerm,
  sortBy,
  sortOrder,
}: Props) {
  const [selectedDispute, setSelectedDispute] =
    useState<ChatDisputesData | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  const { data: chatDisputesData } = useFetchChatDisputes({
    limit: itemsPerPage,
    page: currentPage,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const chatDisputes = chatDisputesData?.data || [];
  const totalPages = chatDisputesData?.totalPage || 1;
  const totalCount = chatDisputesData?.totalCount || 1;

  const handleViewDetails = (dispute: ChatDisputesData) => {
    setSelectedDispute(dispute);
    setDisputeModalOpen(true);
  };

  console.log("reported", chatDisputes);
  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-600/5 dark:bg-white/10">
            <TableRow>
              <TableHead>Reporter</TableHead>
              <TableHead>Reported User</TableHead>
              <TableHead>Message Content</TableHead>
              <TableHead>Report Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chatDisputes && chatDisputes.length > 0 ? (
              chatDisputes.map((dispute, index) => (
                <TableRow key={dispute.id || index}>
                  <TableCell className="p-3 bg-white/5">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          className="rounded-full w-10 h-10"
                          src={
                            dispute.reportedBy.profile_image ||
                            "/placeholder.svg"
                          }
                          alt={dispute.reportedBy.name}
                        />
                        <AvatarFallback className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          {dispute.reportedBy.name
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {dispute.reportedBy.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dispute.reportedBy.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-3 bg-white/5">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          className="rounded-full w-10 h-10"
                          src={
                            dispute.reportedUser.profile_image ||
                            "/placeholder.svg"
                          }
                          alt={dispute.reportedUser.name}
                        />
                        <AvatarFallback className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          {dispute.reportedUser.name
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {dispute.reportedUser.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dispute.reportedUser.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Message Content */}
                  <TableCell className="p-3 bg-white/5">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {dispute.chatMessage.content || "No content"}
                      </p>
                      {dispute.chatMessage.attachments &&
                        dispute.chatMessage.attachments.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            📎 {dispute.chatMessage.attachments.length}{" "}
                            attachment(s)
                          </div>
                        )}
                    </div>
                  </TableCell>

                  {/* Report Reason */}
                  <TableCell className="p-3 bg-white/5">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {dispute.reason || "No reason provided"}
                      </p>
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
                    >
                      {dispute.status}
                    </Badge>
                  </TableCell>

                  {/* Reported Date */}
                  <TableCell className="p-3 bg-white/5">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {dispute.createdAt
                        ? new Date(dispute.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {dispute.createdAt
                        ? new Date(dispute.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : ""}
                    </div>
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
                <TableCell colSpan={7} className="text-center">
                  No Chat Disputes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        totalItems={totalCount}
        handlePageChange={setCurrentPage}
      />

      {selectedDispute && (
        <ChatDisputeDetailsModal
          dispute={selectedDispute}
          open={disputeModalOpen}
          onOpenChange={setDisputeModalOpen}
          // onResolveDispute={handleResolveDispute}
        />
      )}
    </div>
  );
}
