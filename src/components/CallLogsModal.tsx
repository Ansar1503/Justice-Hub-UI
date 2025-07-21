import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFetchCallLogs } from "@/store/tanstack/queries";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { CallLogs } from "@/types/types/callLogs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "lucide-react";

type Props = {
  sessionId?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function getDurationFromStartAndEndDate(
  startDate: Date | undefined,
  endDate: Date | undefined
) {
  if (!startDate || !endDate) return "0.00";
  const durationInMinutes =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  return durationInMinutes.toFixed(2);
}

export default function CallLogsModal({
  sessionId,
  isOpen,
  onOpenChange,
}: Props) {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: callLogData, isLoading: callLogLoading } = useFetchCallLogs({
    sessionId: sessionId || "",
    limit,
    page: currentPage,
  });
  const callLogs = callLogData?.data;

  return (
    <Dialog open={isOpen ? isOpen : false} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <div className="mb-4">
            <DialogTitle className="text-xl">Call Logs</DialogTitle>
            <DialogDescription>Video call Logs</DialogDescription>
          </div>
        </DialogHeader>
        {callLogLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full text-sm text-left">
              <TableHeader className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Total Duration</TableHead>
                  <TableHead>Client Duration</TableHead>
                  <TableHead>Lawyer Duration</TableHead>
                  <TableHead>End Reason</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                {callLogs && callLogs.length > 0 ? (
                  callLogs.map((log: CallLogs) => (
                    <TableRow key={log._id}>
                      <TableCell>{log.status}</TableCell>
                      <TableCell>{String(log?.start_time) || "N/A"}</TableCell>
                      <TableCell>{String(log?.end_time) || "N/A"}</TableCell>
                      <TableCell>{log.duration} min</TableCell>
                      <TableCell>
                        {getDurationFromStartAndEndDate(
                          log?.client_joined_at,
                          log?.client_left_at
                        )}
                      </TableCell>
                      <TableCell>
                        {getDurationFromStartAndEndDate(
                          log?.lawyer_joined_at,
                          log?.lawyer_left_at
                        )}
                      </TableCell>
                      <TableCell>
                        {log?.end_reason || "Network Error"}
                      </TableCell>
                      <TableCell><Badge className="bg-green-500">Join</Badge></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      NO CALL LOGS FOUND
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
