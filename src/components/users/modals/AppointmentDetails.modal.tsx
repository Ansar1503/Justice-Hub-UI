"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  Tag,
  NotepadText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { appointmentOutputDto } from "@/types/types/AppointmentsType";
interface AppointmentDetailModalProps {
  appointment: appointmentOutputDto;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (appointmentId: string) => void;
}

export default function AppointmentDetailModal({
  appointment,
  isOpen,
  onClose,
  onCancel,
}: AppointmentDetailModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeTo12Hour = (time: string) => {
    const [hourStr, minute] = time.split(":");
    let hour = Number.parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleCancelAppointment = () => {
    onCancel(appointment?.id);
    setShowCancelConfirm(false);
    onClose();
  };

  if (!appointment) return null;
  let canCancelAppointment = false;
  if (appointment?.status === "pending") {
    canCancelAppointment = true;
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Appointment Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Lawyer Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Lawyer Information
              </h3>
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  <AvatarImage
                    src={appointment?.lawyerData?.profile_image}
                    alt={appointment?.lawyerData?.name}
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback className="h-full w-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 rounded-full">
                    {appointment?.lawyerData?.name
                      ?.substring(0, 2)
                      ?.toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {appointment?.lawyerData?.name}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Consultation Fee:</span> ₹
                {appointment?.amount}
              </p>
            </div>

            {/* Appointment Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <NotepadText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Reason:</span>{" "}
                  {appointment?.reason}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(appointment?.date)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Time:</span>{" "}
                  {formatTimeTo12Hour(appointment?.time)} (
                  {appointment?.duration} minutes)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Type:</span>{" "}
                  {appointment?.type === "consultation"
                    ? "Consultation"
                    : "Follow-up"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Status:</span>{" "}
                  {appointment?.status.charAt(0).toUpperCase() +
                    appointment?.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {canCancelAppointment && (
              <Button
                variant="destructive"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel Appointment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep appointment</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelAppointment}
            >
              Yes, cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
