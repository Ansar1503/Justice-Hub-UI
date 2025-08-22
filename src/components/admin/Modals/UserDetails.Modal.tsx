"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PhoneIcon, MailIcon, UserIcon } from "lucide-react";

import { DialogDescription } from "@radix-ui/react-dialog";
import { UserProfile } from "@/types/types/AppointmentsType";

interface UserDetailsModalProps {
  user: UserProfile;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UserDetailsModal({
  user,
  trigger,
  open,
  onOpenChange,
}: UserDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog
      open={open !== undefined ? open : isOpen}
      onOpenChange={handleOpenChange}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {user.profile_image ? (
                <AvatarImage
                  src={user.profile_image || "/placeholder.svg"}
                  alt={user.name}
                />
              ) : (
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Basic Information</h4>

            <div className="grid grid-cols-1 gap-2 text-sm">
              {user.user_id && (
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ID:</span>
                  <span>{user.user_id}</span>
                </div>
              )}

              {user.gender && (
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="capitalize">{user.gender}</span>
                </div>
              )}

              {user.dob && (
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{user.dob}</span>
                </div>
              )}

              {user.mobile && (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Mobile:</span>
                  <span>{user.mobile}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
