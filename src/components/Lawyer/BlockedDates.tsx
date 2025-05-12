import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { Trash2 } from "lucide-react";
import {
  useAddBlockedDates,
  useRemoveBlockedDate,
} from "@/store/tanstack/mutations";
import { useFetchBlockedDates } from "@/store/tanstack/queries";

interface BlockedDate {
  _id: string;
  date: Date;
  reason: string;
}

interface BlockedDatesProps {
  onUpdate: () => void;
}

export default function BlockedDates({ onUpdate }: BlockedDatesProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const { mutateAsync: addBlockMutate, isPending: addBlockPending } =
    useAddBlockedDates();
  const { mutateAsync: removeBlockMutate, isPending: removeBlockPending } =
    useRemoveBlockedDate();
  // console.log("selectedDate", selectedDate);
  const { data, refetch } = useFetchBlockedDates();
  const blockedDates = data?.data;
  // console.log("blocked", blockedDates);
  const BlockedDate = async () => {
    if (!selectedDate) {
      setError("select a date to block");
      return;
    }
    if (
      blockedDates.some((d: BlockedDate) => isSameDay(d.date, selectedDate))
    ) {
      setError("already blocked");
      return;
    }
    try {
      
      await addBlockMutate({
        date: selectedDate?.toISOString().split("T")[0],
        reason: reason.trim(),
      });
      refetch();
      setReason("");
      onUpdate();
    } catch (err) {
      console.error("Failed to block date", err);
    } finally {
      setError("");
    }
  };

  const removeBlockedDate = async (id: string) => {
    await removeBlockMutate({ id });
    refetch();
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium dark:text-white">
          Block Specific Dates
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Mark dates when you're unavailable (holidays, personal leave, etc.)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="dark:text-gray-200 mb-2 block">
            Select Date to Block
          </Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) setSelectedDate(new Date(date));
            }}
            disabled={(date) => {
              const isBlocked = blockedDates?.some((blocked: BlockedDate) =>
                isSameDay(new Date(blocked.date), new Date(date))
              );
              const isPast =
                new Date(date).setHours(0, 0, 0, 0) <
                new Date().setHours(0, 0, 0, 0);

              return isBlocked || isPast;
            }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="block-reason" className="dark:text-gray-200">
              Reason (Optional)
            </Label>
            <Textarea
              id="block-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you blocking this date?"
              className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>

          <Button
            type="button"
            onClick={BlockedDate}
            disabled={!selectedDate || addBlockPending || removeBlockPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            Block This Date
          </Button>
          <span className="text-red-600">{error}</span>

          <div className="mt-4">
            <h4 className="font-medium mb-2 dark:text-white">
              Currently Blocked Dates:
            </h4>
            {blockedDates && blockedDates.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No dates blocked yet
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {blockedDates &&
                  blockedDates
                    .sort(
                      (a: BlockedDate, b: BlockedDate) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    .map((blocked: BlockedDate) => (
                      <Card
                        key={blocked._id}
                        className="dark:bg-gray-700 dark:border-gray-600"
                      >
                        <CardContent className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium dark:text-white">
                              {format(new Date(blocked.date), "MMMM d, yyyy")}
                            </div>
                            {blocked.reason && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {blocked.reason}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            disabled={addBlockPending || removeBlockPending}
                            size="icon"
                            onClick={() => removeBlockedDate(blocked._id)}
                            className="h-8 w-8 dark:bg-red-700 dark:hover:bg-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
