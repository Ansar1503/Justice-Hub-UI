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
import { useContext, useState } from "react";
import { SessionDataType } from "@/types/types/sessionType";
import CaseSessionDetails from "./CaseSessionDetails";
import { useFetchCaseSessions } from "@/store/tanstack/Queries/Cases";
import {
  useCancelSessionByLawyer,
  useEndSession,
  useJoinSession,
  useStartSession,
} from "@/store/tanstack/mutations/sessionMutation";
import { SocketContext } from "@/context/SocketProvider";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/redux/Hook";
import { setZcState } from "@/store/redux/zc/zcSlice";
import { SocketEvents } from "@/types/enums/socket";
import { NotificationType } from "@/types/types/Notification";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Calendar, Clock, Eye } from "lucide-react";
import { renderStatusBadge } from "./RenderSessionStatusBadge";

type Props = {
  id: string | undefined;
};

export default function CaseSessionsTab({ id }: Props) {
  const [selectedSession, setSelectedSession] =
    useState<SessionDataType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { data: CaseSessions } = useFetchCaseSessions(id);
  const { mutateAsync: CancelSession } = useCancelSessionByLawyer();
  const { mutateAsync: JoinSessionMutation } = useJoinSession();
  const { mutateAsync: endSessionAsync } = useEndSession();
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.Auth);
  const { mutateAsync: startSessionMutation } = useStartSession();

  const handleJointSession = async (session: any) => {
    if (session?.room_id) {
      const data = await JoinSessionMutation({
        sessionId: session?._id || "",
      });
      dispatch(
        setZcState({
          AppId: data?.zc?.appId,
          roomId: String(data?.room_id),
          token: data?.zc?.token,
        })
      );
      navigate(`/${user?.role}/session/join/${session?._id}`);
      setSelectedSession(session);
    }
  };
  const handleStartSession = async (session: any) => {
    try {
      if (!socket) {
        console.warn("Socket is null");
        return;
      }
      const data = await startSessionMutation({ sessionId: session?.id });
      // console.log("data", data);
      dispatch(
        setZcState({
          roomId: String(data?.room_id),
          token: data?.zc?.token,
          AppId: data?.zc?.appId,
        })
      );
      const { date, time } = formatDateTime(new Date().toString());
      const notificationData: Omit<NotificationType, "id"> = {
        isRead: false,
        message: `Your Session has been started by the lawyer ${selectedSession?.lawyerData?.name} on ${date} at ${time} `,
        sessionId: session?.id,
        roomId: data?.room_id,
        recipientId: session?.client_id,
        senderId: session?.lawyer_id,
        title: "Session Started",
        type: "session",
      };
      if (!socket.connected) {
        console.warn("Socket not yet connected. Waiting...");
        socket.connect();
        socket.once("connect", () => {
          // console.log("Connected after delay, emitting...");
          socket.emit(SocketEvents.NOTIFICATION_SEND, notificationData);
        });
      } else {
        socket.emit(SocketEvents.NOTIFICATION_SEND, notificationData);
      }

      if (data?.room_id) {
        // console.log("data.roomid is available", data?.room_id);
        navigate(`/${user?.role}/session/join/${session?.id}`);
        setSelectedSession(session);
      }
    } catch (err) {
      console.error("Failed to start session", err);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    await endSessionAsync(sessionId);
  };

  const handleCancelSession = async (sessionId: string) => {
    // console.log("Cancelling session:", sessionId);
    await CancelSession({ id: sessionId });
  };
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const renderTypeBadge = (type: string) => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs font-medium bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
        {type === "consultation" ? "Consultation" : "Follow-up"}
      </span>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Case Sessions</CardTitle>
              <CardDescription>
                All sessions and meetings related to this case
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Client Details</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!CaseSessions || CaseSessions?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                CaseSessions?.map((session) => {
                  const { date } = formatDateTime(
                    session?.appointmentDetails?.date.toString()
                  );
                  return (
                    <TableRow key={session.id}>
                      <TableCell>
                        {session.appointmentDetails?.bookingId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border rounded-full overflow-hidden">
                            <AvatarImage
                              src={session?.clientData?.profile_image}
                              alt={session?.clientData?.name}
                              className="h-full w-full object-cover"
                            />
                            <AvatarFallback>
                              {session?.clientData?.name
                                ?.substring(0, 2)
                                ?.toUpperCase() || "NA"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {session?.clientData?.name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {session?.clientData?.email || "N/A"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {session?.clientData?.mobile || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {date}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {session?.appointmentDetails?.time} (
                            {session?.appointmentDetails?.duration} min)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(session?.status)}
                      </TableCell>
                      <TableCell>
                        {renderTypeBadge(session?.appointmentDetails?.type)}
                      </TableCell>
                      <TableCell>
                        ₹{session?.appointmentDetails?.amount || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSession(session);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CaseSessionDetails
        session={selectedSession}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
        }}
        onCancelSession={handleCancelSession}
        onEndSession={handleEndSession}
        onStartSession={handleStartSession}
        onJoinSession={handleJointSession}
      />
    </>
  );
}
