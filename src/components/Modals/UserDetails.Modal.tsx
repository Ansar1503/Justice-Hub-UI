"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, MapPinIcon, PhoneIcon, MailIcon, UserIcon, ShieldIcon, ClockIcon } from "lucide-react"
import { clientDataType } from "@/types/types/Client.data.type"


interface UserDetailsModalProps {
  user: clientDataType
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UserDetailsModal({ user, trigger, open, onOpenChange }: UserDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(open || false)

  // Handle controlled/uncontrolled state
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setIsOpen(newOpen)
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Format date if it exists
  const formatDate = (date?: Date) => {
    if (!date) return "N/A"
    return format(date, "PPP")
  }

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          {/* User header with avatar and status */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {user.profile_image ? (
                <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={user.name} />
              ) : (
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{user.email}</span>
                {user.is_verified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Verified
                  </Badge>
                )}
                {user.is_blocked && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Blocked
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Info */}
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

              {user.role && (
                <div className="flex items-center space-x-2">
                  <ShieldIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Role:</span>
                  <span className="capitalize">{user.role}</span>
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

          {/* Address if available */}
          {user.address && Object.values(user.address).some((value) => value) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Address</h4>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      {user.address.locality && <div>{user.address.locality}</div>}
                      {(user.address.city || user.address.state) && (
                        <div>
                          {user.address.city && `${user.address.city}, `}
                          {user.address.state}
                        </div>
                      )}
                      {(user.address.state || user.address.pincode) && (
                        <div>
                          {user.address.state && `${user.address.state} `}
                          {user.address.pincode && `${user.address.pincode}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Timestamps */}
          {(user.createdAt || user.updatedAt) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Timestamps</h4>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {user.createdAt && (
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  )}
                  {user.updatedAt && (
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Updated:</span>
                      <span>{formatDate(user.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
