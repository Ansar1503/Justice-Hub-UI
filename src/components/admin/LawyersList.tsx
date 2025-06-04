import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Eye,
  ArrowUpDown,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LawyerVerificationModal } from "./Modals/LawyerVerification.Modal";
import { LawerDataType } from "@/types/types/Client.data.type";
import { useFetchAllLawyers } from "@/store/tanstack/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaginationComponent from "../pagination";

export function LawyersList() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "verified" | "rejected" | "pending" | "requested"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name" | "experience" | "consultation_fee" | "createdAt"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedLawyer, setSelectedLawyer] = useState<LawerDataType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const { data, refetch: lawyerrefetch } = useFetchAllLawyers({
    sort: sortBy,
    order: sortOrder,
    search: searchTerm,
    status: statusFilter,
    page: currentPage,
    limit: itemsPerPage,
  });

  useEffect(() => {
    if (data?.data) {
      setLawyers(data.data?.lawyers);
    }
  }, [data?.data, data, data?.data?.lawyers]);

  useEffect(() => {
    async function fetchLawyers() {
      await lawyerrefetch();
    }
    fetchLawyers();
  }, [currentPage, sortBy, sortOrder, searchTerm, statusFilter, lawyerrefetch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder, searchTerm, statusFilter]);

  const totalPages = data?.data?.totalPages;
  const totalItems = data?.data?.totalCount;

  const handleSort = (
    field: "name" | "experience" | "consultation_fee" | "createdAt"
  ) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const viewLawyerDetails = (lawyer: LawerDataType) => {
    setSelectedLawyer(lawyer);
    setIsModalOpen(true);
  };

  const renderStatusBadge = (
    status: "verified" | "pending" | "rejected" | "requested"
  ) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "requested":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Requested
          </Badge>
        );
      default:
        return null;
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">
            Lawyers Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                className="pl-8 bg-white dark:bg-gray-800"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(
                  value:
                    | "all"
                    | "verified"
                    | "rejected"
                    | "pending"
                    | "requested"
                ) => {
                  setStatusFilter(value);
                }}
              >
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white dark:bg-gray-800"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSort("name")}>
                    Name{" "}
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("experience")}>
                    Experience{" "}
                    {sortBy === "experience" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("consultation_fee")}
                  >
                    Fee{" "}
                    {sortBy === "consultation_fee" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                    Joined Date{" "}
                    {sortBy === "createdAt" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table View */}
          <div className="border rounded-md overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort("name")}
                    >
                      Name{" "}
                      {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Practice Areas</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort("experience")}
                    >
                      Exp.{" "}
                      {sortBy === "experience" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort("consultation_fee")}
                    >
                      Fee{" "}
                      {sortBy === "consultation_fee" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lawyers && lawyers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No lawyers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  lawyers &&
                  lawyers.map((lawyer) => (
                    <TableRow
                      key={lawyer?.user_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage
                              src={lawyer?.clientData?.profile_image}
                              alt={lawyer?.name}
                            />
                            <AvatarFallback>
                              {lawyer?.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lawyer?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {lawyer?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(lawyer?.verification_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lawyer.lawyerData &&
                            lawyer.lawyerData.practice_areas &&
                            lawyer.lawyerData?.practice_areas?.length > 0 &&
                            lawyer.lawyerData.practice_areas
                              .slice(
                                0,
                                lawyer.lawyerData.practice_areas.length - 1
                              )
                              .map((area: any) => (
                                <Badge
                                  key={area}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {area}
                                </Badge>
                              ))}
                          {lawyer.lawyerData.practice_areas.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lawyer.lawyerData.practice_areas.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{lawyer.lawyerData.experience} yrs</TableCell>
                      <TableCell>
                        ₹{lawyer.lawyerData.consultation_fee}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewLawyerDetails(lawyer)}
                          className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <PaginationComponent
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>

      {selectedLawyer && (
        <LawyerVerificationModal
          lawyer={selectedLawyer}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
