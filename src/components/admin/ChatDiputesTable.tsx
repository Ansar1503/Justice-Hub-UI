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
import { UserDetailsModal } from "./Modals/UserDetails.Modal";
import ChatDisputeDetailsModal from "@/components/admin/Modals/ChatDisputeDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "../ui/badge";
import { useState } from "react";

type Props = {
  itemsPerPage: number;
  currentPage: number;
  searchTerm: string;
  sortBy: "All" | "session_date" | "reported_date";
  sortOrder: "asc" | "desc";
  setCurrentPage: (p: number) => void;
};

export default function ChatDiputesTable({
  setCurrentPage,
  currentPage,
  itemsPerPage,
  searchTerm,
  sortBy,
  sortOrder,
}: Props) {
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
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

  const handleViewDetails = (dispute: any) => {
    setSelectedDispute(dispute);
    setDisputeModalOpen(true);
  };

  // const handleResolveDispute = (
  //   disputeId: string,
  //   action: "dismiss" | "warn" | "suspend" | "delete"
  // ) => {
  //   console.log(`Resolving dispute ${disputeId} with action: ${action}`);
  // };

  return (
    <>
      <Table>
        <TableHeader className="bg-stone-600/5 dark:bg-white/10">
          <TableRow>
            <TableHead>Reporter</TableHead>
            <TableHead>Reported User</TableHead>
            <TableHead>Message Content</TableHead>
            <TableHead>Report Reason</TableHead>
            <TableHead>Reported Date</TableHead>
            <TableHead>Session</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chatDisputes && chatDisputes.length > 0 ? (
            chatDisputes.map((message, index) => (
              <TableRow key={message._id || index}>
                {/* Reporter (who reported the message) */}
                <TableCell className="p-3 bg-white/5">
                  <UserDetailsModal
                    user={
                      message.senderId ===
                      message.chatSession.participants.lawyer_id
                        ? message.chatSession.clientData
                        : message.chatSession.lawyerData
                    }
                    trigger={
                      <div className="flex items-center gap-3 cursor-pointer">
                        <Avatar>
                          {(
                            message.senderId ===
                            message.chatSession.participants.lawyer_id
                              ? message.chatSession.clientData.profile_image
                              : message.chatSession.lawyerData.profile_image
                          ) ? (
                            <AvatarImage
                              className="rounded-full w-10"
                              src={
                                message.senderId ===
                                message.chatSession.participants.lawyer_id
                                  ? message.chatSession.clientData.profile_image
                                  : message.chatSession.lawyerData.profile_image
                              }
                              alt={
                                message.senderId ===
                                message.chatSession.participants.lawyer_id
                                  ? message.chatSession.clientData.name
                                  : message.chatSession.lawyerData.name
                              }
                            />
                          ) : (
                            <AvatarFallback>
                              {(message.senderId ===
                              message.chatSession.participants.lawyer_id
                                ? message.chatSession.clientData.name
                                : message.chatSession.lawyerData.name
                              )
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {message.senderId ===
                            message.chatSession.participants.lawyer_id
                              ? message.chatSession.clientData.name
                              : message.chatSession.lawyerData.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {message.senderId ===
                            message.chatSession.participants.lawyer_id
                              ? "Client"
                              : "Lawyer"}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </TableCell>

                {/* Reported User (who sent the reported message) */}
                <TableCell className="p-3 bg-white/5">
                  <UserDetailsModal
                    user={
                      message.senderId ===
                      message.chatSession.participants.lawyer_id
                        ? message.chatSession.lawyerData
                        : message.chatSession.clientData
                    }
                    trigger={
                      <div className="flex items-center gap-3 cursor-pointer">
                        <Avatar>
                          {(
                            message.senderId ===
                            message.chatSession.participants.lawyer_id
                              ? message.chatSession.lawyerData.profile_image
                              : message.chatSession.clientData.profile_image
                          ) ? (
                            <AvatarImage
                              className="rounded-full w-10"
                              src={
                                message.senderId ===
                                message.chatSession.participants.lawyer_id
                                  ? message.chatSession.lawyerData.profile_image
                                  : message.chatSession.clientData.profile_image
                              }
                              alt={
                                message.senderId ===
                                message.chatSession.participants.lawyer_id
                                  ? message.chatSession.lawyerData.name
                                  : message.chatSession.clientData.name
                              }
                            />
                          ) : (
                            <AvatarFallback>
                              {(message.senderId ===
                              message.chatSession.participants.lawyer_id
                                ? message.chatSession.lawyerData.name
                                : message.chatSession.clientData.name
                              )
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {message.senderId ===
                            message.chatSession.participants.lawyer_id
                              ? message.chatSession.lawyerData.name
                              : message.chatSession.clientData.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {message.senderId ===
                            message.chatSession.participants.lawyer_id
                              ? "Lawyer"
                              : "Client"}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </TableCell>

                {/* Message Content */}
                <TableCell className="p-3 bg-white/5">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-900 dark:text-white truncate">
                      {message.content}
                    </p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        📎 {message.attachments.length} attachment(s)
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Report Reason */}
                <TableCell className="p-3 bg-white/5">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {message.report?.reason || "No reason provided"}
                    </p>
                  </div>
                </TableCell>

                {/* Reported Date */}
                <TableCell className="p-3 bg-white/5">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {message.report?.reportedAt
                      ? new Date(message.report.reportedAt).toLocaleDateString(
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
                    {message.report?.reportedAt
                      ? new Date(message.report.reportedAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : ""}
                  </div>
                </TableCell>

                {/* Session Info */}
                <TableCell className="p-3 bg-white/5">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {message.chatSession.name}
                    </p>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="p-3 bg-white/5">
                  <div className="flex justify-center gap-2">
                    <Badge
                      className="cursor-pointer hover:bg-blue-200 transition-colors"
                      variant="secondary"
                      onClick={() => handleViewDetails(message)}
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
        <PaginationComponent
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          totalItems={totalCount}
          handlePageChange={setCurrentPage}
        />
      </Table>

      {/* Chat Dispute Details Modal */}
      {selectedDispute && (
        <ChatDisputeDetailsModal
          dispute={selectedDispute}
          open={disputeModalOpen}
          onOpenChange={setDisputeModalOpen}
          // onResolveDispute={handleResolveDispute}
        />
      )}
    </>
  );
}
