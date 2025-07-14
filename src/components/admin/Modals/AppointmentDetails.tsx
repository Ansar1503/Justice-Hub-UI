"use client";

import type React from "react";
import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  IndianRupeeIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import type { Appointment } from "@/types/types/AppointmentsType";
import { clientDataType, userDataType } from "@/types/types/Client.data.type";

interface AppointmentDetailsProps {
  appointment: Appointment & {
    clientData: userDataType & clientDataType;
    lawyerData: userDataType & clientDataType;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AppointmentDetails({
  appointment,
  trigger,
  open,
  onOpenChange,
}: AppointmentDetailsProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: Appointment["payment_status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "cancelled":
      case "rejected":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <AlertCircleIcon className="h-4 w-4" />;
    }
  };

  return (
    <Dialog
      open={open !== undefined ? open : isOpen}
      onOpenChange={handleOpenChange}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            Complete information about this appointment
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-6 py-4">
          {/* Appointment Status and Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(appointment.status)}
              <Badge
                variant="outline"
                className={getStatusColor(appointment.status)}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Badge>
              <Badge variant="secondary">
                {appointment.type.charAt(0).toUpperCase() +
                  appointment.type.slice(1)}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Appointment ID
              </div>
              <div className="font-mono text-sm">{appointment._id}</div>
            </div>
          </div>

          <Separator />

          {/* Date and Time Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Schedule Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Date</span>
                <div className="font-medium">
                  {formatDate(appointment.date)}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Time</span>
                <div className="font-medium">
                  {formatTime(appointment.time)}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Duration</span>
                <div className="font-medium">
                  {appointment.duration} minutes
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lawyer Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Lawyer Information</h4>
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                {appointment.lawyerData?.profile_image ? (
                  <AvatarImage
                    src={
                      appointment.lawyerData.profile_image || "/placeholder.svg"
                    }
                    alt={appointment.lawyerData.name}
                  />
                ) : (
                  <AvatarFallback>
                    {getInitials(appointment.lawyerData?.name || "Unknown")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">
                  {appointment.lawyerData?.name}
                </div>
                <div className="text-sm text-muted-foreground flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <MailIcon className="h-3 w-3" />
                    <span>{appointment.lawyerData?.email}</span>
                  </span>
                  {appointment.lawyerData?.mobile && (
                    <span className="flex items-center space-x-1">
                      <PhoneIcon className="h-3 w-3" />
                      <span>{appointment.lawyerData.mobile}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Client Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Client Information</h4>
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                {appointment.clientData?.profile_image ? (
                  <AvatarImage
                    src={
                      appointment.clientData.profile_image || "/placeholder.svg"
                    }
                    alt={appointment.clientData.name}
                  />
                ) : (
                  <AvatarFallback>
                    {getInitials(appointment.clientData?.name || "Unknown")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">
                  {appointment.clientData?.name}
                </div>
                <div className="text-sm text-muted-foreground flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <MailIcon className="h-3 w-3" />
                    <span>{appointment.clientData?.email}</span>
                  </span>
                  {appointment.clientData?.mobile && (
                    <span className="flex items-center space-x-1">
                      <PhoneIcon className="h-3 w-3" />
                      <span>{appointment.clientData.mobile}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <FileTextIcon className="h-4 w-4" />
              <span>Appointment Details</span>
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">
                  Reason for Consultation
                </span>
                <div className="mt-1 p-3 bg-muted/50 rounded-lg text-sm">
                  {appointment.reason || "No reason provided"}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <CreditCardIcon className="h-4 w-4" />
              <span>Payment Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Amount</span>
                <div className="flex items-center space-x-1 font-medium">
                  <IndianRupeeIcon className="h-4 w-4" />
                  <span>{appointment.amount}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  Payment Status
                </span>
                <Badge
                  variant="outline"
                  className={`${getPaymentStatusColor(
                    appointment.payment_status
                  )} ml-2`}
                >
                  {appointment.payment_status.charAt(0).toUpperCase() +
                    appointment.payment_status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          {(appointment.createdAt || appointment.updateAt) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>Timeline</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {appointment.createdAt && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Created</span>
                      <div>
                        {format(new Date(appointment.createdAt), "PPp")}
                      </div>
                    </div>
                  )}
                  {appointment.updateAt && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground">
                        Last Updated
                      </span>
                      <div>{format(new Date(appointment.updateAt), "PPp")}</div>
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
  );
}
