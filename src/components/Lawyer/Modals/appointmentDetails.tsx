"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  Tag,
  NotepadText,
  Phone,
  Mail,
  CircleDollarSign,
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
import { DialogDescription } from "@radix-ui/react-dialog";

interface ClientAppointmentDetailModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointmentId: string) => void;
  onReject: (appointmentId: string) => void;
}

export default function ClientAppointmentDetailModal({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  onReject,
}: ClientAppointmentDetailModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

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

  const handleConfirmAppointment = () => {
    onConfirm(appointment?._id);
    setShowConfirmDialog(false);
    onClose();
  };

  const handleRejectAppointment = () => {
    onReject(appointment?._id);
    setShowRejectDialog(false);
    onClose();
  };

  if (!appointment) return null;

  const canConfirmOrReject = appointment?.status === "pending";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Client Appointment Details
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Client Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Client Information
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600 dark:text-green-300">
                    {appointment?.userData?.name
                      ?.split(" ")
                      .map((n: string) => n[0].toUpperCase())
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {appointment?.userData?.name}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="h-3 w-3" />
                    {appointment?.userData?.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <Phone className="h-3 w-3" />
                <span className="font-medium">Phone:</span>{" "}
                {appointment?.userData?.phone || "N/A"}
              </div>
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
                  {appointment?.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Payment Status:</span>{" "}
                  {appointment?.payment_status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Consultation Fee:</span> ₹
                  {appointment?.amount}
                </span>
              </div>
            </div>

            {/* Additional Information */}
            {appointment?.notes && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Notes
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {appointment?.notes}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {canConfirmOrReject && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirm
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Appointment Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this appointment with{" "}
              {appointment?.clientData?.name}? The client will be notified of
              the confirmation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirmAppointment}
            >
              Yes, confirm appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Appointment Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this appointment with{" "}
              {appointment?.clientData?.name}? The client will be notified of
              the rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRejectAppointment}
            >
              Yes, reject appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
