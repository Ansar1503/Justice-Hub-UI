"use client";
import  { useState } from "react";
import { useFetchClientData } from "@/hooks/tanstack/queries"; // Import the query hook
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
import { Filter, MoreHorizontal } from "lucide-react";
import { clientDataType } from "@/types/types/Client.data.type";

export function UserManagement() {
  const [activeTab, setActiveTab] = useState<"all" | "client" | "lawyer">("all"); 
  const [search, setSearch] = useState(""); 

  const { data: users, isLoading, isError, error } = useFetchClientData(); 
  console.log("users", users);
  const filteredUsers = users.filter((user: clientDataType) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      activeTab === "all" || user.role?.toLowerCase() === activeTab;
    return matchesSearch && matchesRole;
  });
  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (isError) {
    return <div>Error: {error.message}</div>; 
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
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger
                value="all"
                onClick={() => setActiveTab("all")}
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                value="client"
                onClick={() => setActiveTab("client")}
              >
                Clients
              </TabsTrigger>
              <TabsTrigger
                value="lawyer"
                onClick={() => setActiveTab("lawyer")}
              >
                Lawyers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Blocked</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user: clientDataType) => (
                    <TableRow key={user.user_id}>
                      {/* User Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={user.profile_image || "/placeholder.svg"}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
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
                          variant={user.is_verified ? "secondary" : "outline"}
                        >
                          {user.is_verified ? "Verified" : "Not Verified"}
                        </Badge>
                      </TableCell>

                      {/* Blocked */}
                      <TableCell>
                        <Badge
                          variant={user.is_blocked ? "destructive" : "outline"}
                        >
                          {user.is_blocked ? "Blocked" : "Active"}
                        </Badge>
                      </TableCell>

                      {/* Join Date */}
                      <TableCell>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "N/A"}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
