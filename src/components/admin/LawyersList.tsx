"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Eye,
  ArrowUpDown,
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
import { LawyerVerificationModal } from "../Modals/LawyerVerification.Modal";
import { LawerDataType } from "@/types/types/Client.data.type";
import { useFetchAllLawyers } from "@/hooks/tanstack/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LawyersList() {
  const { data } = useFetchAllLawyers();
  const [lawyers, setLawyers] = useState<LawerDataType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedLawyer, setSelectedLawyer] = useState<LawerDataType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setLawyers(data.data);
    }
  }, [data]);

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lawyer.verification_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedLawyers = [...filteredLawyers].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "experience":
        comparison = a.experience - b.experience;
        break;
      case "fee":
        comparison = a.consultation_fee - b.consultation_fee;
        break;
      case "joined":
        comparison =
          new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const viewLawyerDetails = (lawyer: LawerDataType) => {
    setSelectedLawyer(lawyer);
    setIsModalOpen(true);
  };

  const renderStatusBadge = (status: "verified" | "pending" | "rejected") => {
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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Lawyers Verification</CardTitle>
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-gray-800">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSort("name")}>
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("experience")}>
                    Experience{" "}
                    {sortBy === "experience" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("fee")}>
                    Fee {sortBy === "fee" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("joined")}>
                    Joined Date{" "}
                    {sortBy === "joined" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Display count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {sortedLawyers.length} of {lawyers.length} lawyers
            </p>
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
                      onClick={() => handleSort("fee")}
                    >
                      Fee {sortBy === "fee" && (sortOrder === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLawyers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No lawyers found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLawyers.map((lawyer) => (
                    <TableRow key={lawyer.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage
                              src={lawyer.profile_image || "/placeholder.svg"}
                              alt={lawyer.name}
                            />
                            <AvatarFallback>
                              {lawyer.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lawyer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {lawyer.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(lawyer.verification_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lawyer.practice_areas.slice(0, 2).map((area) => (
                            <Badge
                              key={area}
                              variant="secondary"
                              className="text-xs"
                            >
                              {area}
                            </Badge>
                          ))}
                          {lawyer.practice_areas.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lawyer.practice_areas.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{lawyer.experience} yrs</TableCell>
                      <TableCell>₹{lawyer.consultation_fee}</TableCell>
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