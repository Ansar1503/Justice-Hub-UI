import { useState, useEffect, useMemo } from "react";
import { useFetchUsersByRole } from "@/store/tanstack/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { MoreHorizontal, Check, X } from "lucide-react";
import { clientDataType } from "@/types/types/Client.data.type";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDetailsModal } from "@/components/admin/Modals/UserDetails.Modal";
import { toast } from "react-toastify";
import { Paginations } from "../ui/custom/Pagination";
import { useBlockUser } from "@/store/tanstack/mutations";

export function UserManagement() {
  const [activeTab, setActiveTab] = useState<"client" | "lawyer">("client");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "verified" | "blocked"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { mutateAsync } = useBlockUser();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchUser,
  } = useFetchUsersByRole({
    role: activeTab,
    search,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter,
  });

  useEffect(() => {
    async function refetch() {
      await refetchUser();
    }
    refetch();
  }, [currentPage, refetchUser]);
  console.log("data:", data);
  const users = useMemo(() => data?.data || [], [data]);
  console.log("users", users);
  const totalCount = useMemo(() => data?.totalCount || 0, [data]);
  const totalPages = useMemo(
    () => Math.ceil(totalCount / itemsPerPage),
    [totalCount, itemsPerPage]
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (isError) {
      if ((error as any).response && (error as any).response.data) {
        toast.error(
          (error as any).response.data.message ||
            "An error occurred while fetching data."
        );
      } else if (error.message === "Network Error") {
        toast.error("Network Error: Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  }, [isError, error]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleTabChange(tab: "client" | "lawyer") {
    setActiveTab(tab);
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage clients and lawyers in the system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-full max-w-[200px]" />
              <Skeleton className="h-10 w-full max-w-[180px]" />
              <Skeleton className="h-10 w-full max-w-[180px]" />
            </div>

            <div className="mt-4">
              <Skeleton className="h-8 w-full mb-2" />
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-full max-w-[200px]" />
                  <Skeleton className="h-6 w-full max-w-[100px]" />
                  <Skeleton className="h-6 w-full max-w-[100px]" />
                  <Skeleton className="h-6 w-full max-w-[150px]" />
                  <Skeleton className="h-6 w-full max-w-[50px]" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage clients and lawyers in the system
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={handleSearch}
              className="pl-8"
            />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | "verified" | "blocked")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "name" | "createdAt")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="createdAt">Join Date</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue={activeTab} value={activeTab}>
            <TabsList>
              <TabsTrigger
                value="client"
                onClick={() => handleTabChange("client")}
              >
                Clients
              </TabsTrigger>
              <TabsTrigger
                value="lawyer"
                onClick={() => handleTabChange("lawyer")}
              >
                Lawyers
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-slate-800">
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email Verified</TableHead>
                    {activeTab === "lawyer" && <TableHead>Status</TableHead>}
                    <TableHead>Blocked</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users?.length > 0 ? (
                    users.map((user: clientDataType) => (
                      <TableRow
                        key={user.user_id || user.email}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        {/* User Info */}
                        <TableCell>
                          <UserDetailsModal
                            user={user}
                            trigger={
                              <div className="flex items-center gap-3 cursor-pointer">
                                <Avatar>
                                  {user.profile_image ? (
                                    <AvatarImage
                                      src={user.profile_image}
                                      alt={user.name}
                                    />
                                  ) : (
                                    <AvatarFallback>
                                      {user.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "client"
                                ? "outline"
                                : user.role === "lawyer"
                                ? "secondary"
                                : undefined
                            }
                            className={`${
                              user.role === "client"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {user.role
                              ? user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)
                              : "Unknown"}
                          </Badge>
                        </TableCell>

                        {/* Verified */}
                        <TableCell>
                          <Badge
                            className={`${
                              user.is_verified
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.is_verified ? "Verified" : "Not Verified"}
                          </Badge>
                        </TableCell>

                        {/* Status (Lawyers) */}
                        {activeTab === "lawyer" && (
                          <TableCell>
                            <Badge
                              className={`${
                                (user as any).lawyerData?.verification_status ==
                                "verified"
                                  ? "bg-green-100 text-green-800"
                                  : (user as any).lawyerData
                                      ?.verification_status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {(user as any).lawyerData?.verification_status
                                ? (user as any).lawyerData?.verification_status
                                    .charAt(0)
                                    .toUpperCase() +
                                  (
                                    user as any
                                  ).lawyerData?.verification_status.slice(1)
                                : "pending"}
                            </Badge>
                          </TableCell>
                        )}

                        {/* Blocked */}
                        <TableCell>
                          <Badge
                            className={`${
                              user.is_blocked
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.is_blocked ? "Blocked" : "Active"}
                          </Badge>
                        </TableCell>

                        {/* Join Date */}
                        <TableCell>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.is_blocked ? (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!user.user_id) return;
                                    await mutateAsync(user.user_id);
                                    document.body.click();
                                  }}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Unblock
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!user.user_id) return;
                                    await mutateAsync(user.user_id);
                                    document.body.click();
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Block
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={activeTab === "lawyer" ? 7 : 6}
                        className="text-center"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
          {totalPages > 1 && (
            <Paginations
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
