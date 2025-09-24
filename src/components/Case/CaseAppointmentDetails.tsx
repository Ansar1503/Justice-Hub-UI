import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  Tag,
  IndianRupee,
  CreditCard,
} from "lucide-react";
import { Appointment } from "@/types/types/AppointmentsType";
import Confirmation from "../Confirmation";
import { useAppSelector } from "@/store/redux/Hook";
import {
  useCancellAppointment,
  useConfirmAppointment,
  useRejectAppointment,
} from "@/store/tanstack/mutations";

type Props = {
  appointment: Appointment | null;
  isOpen: boolean;
  setOpen: (val: boolean) => void;
};

export default function CaseAppointmentDetails({
  appointment,
  isOpen,
  setOpen,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const { mutateAsync: cancelAppointmentMutate } = useCancellAppointment();
  const { mutateAsync: rejectMutation } = useRejectAppointment();
  const { mutateAsync: confirmAppointmentMutation } = useConfirmAppointment();
  const { user } = useAppSelector((s) => s.Auth);
  if (!appointment) return null;

  const isCurrentUserClient = appointment.client_id == user?.user_id;
  const isConfirmableOrRejectable = appointment.status === "pending";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const formatTimeTo12Hour = (time: string) => {
    const [hourStr, minute] = time.split(":");
    let hour = Number.parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleConfirm = async () => {
    try {
      await confirmAppointmentMutation({
        id: appointment.id,
        status: "confirmed",
      });
      setOpen(false);
    } catch (error) {
      console.log("error confirm appintment", error);
    }
  };
  const handleReject = async () => {
    try {
      await rejectMutation({ id: appointment.id, status: "rejected" });
      setOpen(false);
    } catch (error) {
      console.log("error rejecting appintment", error);
    }
  };
  const handleCancel = async () => {
    try {
      await cancelAppointmentMutate({
        id: appointment.id,
        status: "cancelled",
      });
      setOpen(false);
    } catch (error) {
      console.log("eroro cancelling ", error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Appointment Details</DialogTitle>
            <DialogDescription>
              Booking ID:{" "}
              <span className="font-mono">{appointment.bookingId}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Lawyer */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Lawyer ID:</span>{" "}
                {appointment.lawyer_id}
              </span>
            </div>

            {/* Client */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Client ID:</span>{" "}
                {appointment.client_id}
              </span>
            </div>

            {/* Reason */}
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Reason:</span>{" "}
                {appointment.reason}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Date:</span>{" "}
                {formatDate(appointment.date)}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Time:</span>{" "}
                {formatTimeTo12Hour(appointment.time)} ({appointment.duration}{" "}
                mins)
              </span>
            </div>

            {/* Type */}
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Type:</span>{" "}
                {appointment.type === "consultation"
                  ? "Consultation"
                  : "Follow-up"}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Status:</span>{" "}
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Fee:</span> ₹{appointment.amount}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span
                className={`text-sm font-medium ${
                  appointment.payment_status === "success"
                    ? "text-green-600"
                    : appointment.payment_status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Payment:{" "}
                {appointment.payment_status.charAt(0).toUpperCase() +
                  appointment.payment_status.slice(1)}
              </span>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            {!isCurrentUserClient && isConfirmableOrRejectable && (
              <>
                <Button variant="default" onClick={() => setConfirmOpen(true)}>
                  Confirm
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectOpen(true)}
                >
                  Reject
                </Button>
              </>
            )}

            {isCurrentUserClient && isConfirmableOrRejectable && (
              <Button variant="secondary" onClick={() => setCancelOpen(true)}>
                Cancel
              </Button>
            )}

            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modals */}
      <Confirmation
        open={confirmOpen}
        setOpen={setConfirmOpen}
        handleAction={handleConfirm}
        title="Confirm Appointment"
        description="Are you sure you want to confirm this appointment?"
        actionText="Yes, confirm"
        className="bg-green-600 text-white hover:bg-green-700"
      />

      <Confirmation
        open={rejectOpen}
        setOpen={setRejectOpen}
        handleAction={handleReject}
        title="Reject Appointment"
        description="Are you sure you want to reject this appointment? This action cannot be undone."
        actionText="Yes, reject"
        className="bg-red-600 text-white hover:bg-red-700"
      />

      <Confirmation
        open={cancelOpen}
        setOpen={setCancelOpen}
        handleAction={handleCancel}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        actionText="Yes, cancel"
        className="bg-yellow-600 text-white hover:bg-yellow-700"
      />
    </>
  );
}
