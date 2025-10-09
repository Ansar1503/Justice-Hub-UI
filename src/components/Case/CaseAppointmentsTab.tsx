"use client";

import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { appointmentOutputDto } from "@/types/types/AppointmentsType";
import { useFetchCaseAppointments } from "@/store/tanstack/Queries/Cases";
import CaseAppointmentDetails from "./CaseAppointmentDetails";
import { useState } from "react";
import { useAppSelector } from "@/store/redux/Hook";

type Props = {
  id: string | undefined;
};

export default function CaseAppointmentsTab({ id }: Props) {
  const { user } = useAppSelector((s) => s.Auth);
  const [selectedAppointment, setSelectedAppointment] =
    useState<appointmentOutputDto | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { data: CaseAppointments } = useFetchCaseAppointments(id);
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Case Appointments</CardTitle>
              <CardDescription>
                All appointments and meetings related to this case
              </CardDescription>
            </div>
            {/* {user?.role !== "lawyer" && (
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            )} */}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-muted/30">
                <TableHead className="font-semibold">Booking ID</TableHead>
                <TableHead className="font-semibold">Lawyer</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CaseAppointments && CaseAppointments.length > 0 ? (
                CaseAppointments.map((appointment: appointmentOutputDto) => (
                  <TableRow key={appointment.id} className="hover:bg-muted/20">
                    <TableCell>{appointment.bookingId}</TableCell>
                    <TableCell>{appointment.lawyerData?.name}</TableCell>
                    <TableCell>{appointment.clientData?.name}</TableCell>
                    <TableCell>
                      {appointment.type === "consultation"
                        ? "Consultation"
                        : "Follow-up"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          appointment.status === "pending"
                            ? "text-yellow-600"
                            : appointment.status === "confirmed"
                            ? "text-blue-600"
                            : appointment.status === "completed"
                            ? "text-green-600"
                            : appointment.status === "cancelled"
                            ? "text-gray-500"
                            : "text-red-600"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`font-semibold ${
                          appointment.payment_status === "success"
                            ? "text-green-600"
                            : appointment.payment_status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {appointment.payment_status.charAt(0).toUpperCase() +
                          appointment.payment_status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-gray-500"
                  >
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CaseAppointmentDetails
        appointment={selectedAppointment}
        isOpen={isDetailsModalOpen}
        setOpen={setIsDetailsModalOpen}
      />
    </>
  );
}
