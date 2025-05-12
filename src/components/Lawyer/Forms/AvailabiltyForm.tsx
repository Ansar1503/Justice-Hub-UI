"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  useAddAvailableTimeSlot,
  useRemoveOneAvailableSlot,
  // useUpdateAvailableSlot,
} from "@/store/tanstack/mutations";
import { useFetchAvailableSlots } from "@/store/tanstack/queries";
import { useEffect } from "react";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilityFormProps {
  selectedDate: Date | undefined;
  onUpdate: () => void;
}

export default function AvailabilityForm({
  selectedDate,
  onUpdate,
}: AvailabilityFormProps) {
  const { mutateAsync: addAvailableSlotMutation } = useAddAvailableTimeSlot();
  const { data, refetch } = useFetchAvailableSlots(selectedDate);
  const { mutateAsync: removeOneSlot } = useRemoveOneAvailableSlot();
  // const { mutateAsync: updateSlotMutate } = useUpdateAvailableSlot();
  // console.log("data", data);
  const availableSlot = data?.data;

  useEffect(() => {
    if (selectedDate) {
      refetch();
    }
  }, [selectedDate]);

  const addTimeSlot = async () => {
    if (!selectedDate) return;
    // console.log("selected date:", selectedDate, "type : ", typeof selectedDate);
    // console.log("to string ", selectedDate.toString());
    await addAvailableSlotMutation({
      date: selectedDate,
    });
    onUpdate();
  };

  const removeTimeSlot = async (slot: TimeSlot) => {
    if (!selectedDate) return;
    await removeOneSlot({
      date: selectedDate,
      endTime: slot.endTime,
      startTime: slot.startTime,
    });
    refetch();
    onUpdate();
  };

  // const updateTimeSlot = async (
  //   slot: TimeSlot,
  //   field: "startTime" | "endTime",
  //   value: string
  // ) => {
  //   if (!selectedDate) return;
  //   await updateSlotMutate({
  //     prev: {
  //       date: selectedDate,
  //       endTime: slot.endTime,
  //       startTime: slot.startTime,
  //     },
  //     update: { key: field, value },
  //   });
  //   refetch();
  //   onUpdate();
  // };

  
  return (
    <form >
      <div className="mb-4">
        <h3 className="text-lg font-medium dark:text-white">
          {selectedDate
            ? format(selectedDate, "EEEE, MMMM d, yyyy")
            : "Select a date"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add available time slots for this specific date
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {availableSlot &&
          availableSlot.timeSlots?.length > 0 &&
          availableSlot.timeSlots?.map((slot: TimeSlot, index: number) => (
            <Card key={index} className="dark:bg-gray-700 dark:border-gray-600">
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full sm:w-5/12">
                    <Label
                      htmlFor={`start-time-${index}`}
                      className="dark:text-gray-200"
                    >
                      Start Time
                    </Label>
                    <Input
                      id={`start-time-${index}`}
                      type="time"
                      value={slot.startTime}
                      // onChange={(e) =>
                      //   updateTimeSlot(slot, "startTime", e.target.value)
                      // }
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-5/12">
                    <Label
                      htmlFor={`end-time-${index}`}
                      className="dark:text-gray-200"
                    >
                      End Time
                    </Label>
                    <Input
                      id={`end-time-${index}`}
                      type="time"
                      value={slot.endTime}
                      // onChange={(e) =>
                      //   updateTimeSlot(slot, "endTime", e.target.value)
                      // }
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-2/12 flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeTimeSlot(slot)}
                      disabled={
                        !availableSlot || availableSlot.timeSlots?.length === 0
                      }
                      className="dark:bg-red-700 dark:hover:bg-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={addTimeSlot}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Time Slot
        </Button>

        {/* <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          disabled={!selectedDate}
        >
          Save Availability
        </Button> */}
      </div>
    </form>
  );
}
