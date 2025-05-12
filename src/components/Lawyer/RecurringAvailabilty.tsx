import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  useAddRecurringSlot,
  useRemoveRecurringSlot,
  useUpdateRecurringSlot,
} from "@/store/tanstack/mutations";
import { dayType, reccuringType } from "@/types/types/SlotTypes";
import { useFetchAllRecurringSlot } from "@/store/tanstack/queries";

interface RecurringSlot {
  _id: string;
  day: dayType;
  startTime: string;
  endTime: string;
  active: boolean;
}

interface RecurringAvailabilityProps {
  onUpdate: () => void;
}

export default function RecurringAvailability({
  onUpdate,
}: RecurringAvailabilityProps) {
  const { mutateAsync: addRecurringMutate } = useAddRecurringSlot();
  const { mutateAsync: updateRecurringMutate } = useUpdateRecurringSlot();

  const { data } = useFetchAllRecurringSlot();
  const recurringSlots = data?.data;
  const { mutateAsync: removeRecurringMutate } = useRemoveRecurringSlot();
  // console.log("recurringg:", recurringSlots);
  
  const addRecurringSlot = async (day: dayType) => {
    await addRecurringMutate({ day });
    onUpdate();
  };

  const removeRecurringSlot = async (day: dayType) => {
    await removeRecurringMutate({ day });
    onUpdate();
  };

  const updateRecurringSlot = async (
    day: dayType,
    key: keyof Omit<RecurringSlot, "_id" | "day">,
    value: string | boolean
  ) => {
    await updateRecurringMutate({ day, key, value });
    onUpdate();
  };

  const weekdays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const availableWeekdays = weekdays.filter(
    (day) =>
      !recurringSlots ||
      !recurringSlots.schedule ||
      recurringSlots.schedule?.length === 0 ||
      !recurringSlots.schedule?.some(
        (slot: reccuringType) => slot.day === day.value
      )
  );

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-medium dark:text-white">
          Recurring Weekly Schedule
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Set your regular weekly availability pattern
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {recurringSlots &&
          recurringSlots.schedule &&
          recurringSlots.schedule
            .sort((a: RecurringSlot, b: RecurringSlot) => {
              const dayOrder = [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ];
              return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
            })
            .map((slot: RecurringSlot) => (
              <Card
                key={slot._id}
                className={`dark:border-gray-600 ${
                  slot.active
                    ? "dark:bg-gray-700"
                    : "dark:bg-gray-800 opacity-70"
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="w-full sm:w-3/12">
                      <Label className="dark:text-gray-200">Day</Label>
                      <div className="text-base font-medium mt-2 dark:text-white capitalize">
                        {slot.day}
                      </div>
                    </div>
                    <div className="w-full sm:w-3/12">
                      <Label
                        htmlFor={`start-time-${slot._id}`}
                        className="dark:text-gray-200"
                      >
                        Start Time
                      </Label>
                      <Input
                        id={`start-time-${slot._id}`}
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateRecurringSlot(
                            slot.day,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        disabled={!slot.active}
                        required
                      />
                    </div>
                    <div className="w-full sm:w-3/12">
                      <Label
                        htmlFor={`end-time-${slot._id}`}
                        className="dark:text-gray-200"
                      >
                        End Time
                      </Label>
                      <Input
                        id={`end-time-${slot._id}`}
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateRecurringSlot(
                            slot.day,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        disabled={!slot.active}
                        required
                      />
                    </div>
                    <div className="w-full sm:w-3/12 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`active-${slot._id}`}
                          checked={slot.active}
                          onCheckedChange={(checked) =>
                            updateRecurringSlot(slot.day, "active", checked)
                          }
                        />
                        <Label
                          htmlFor={`active-${slot._id}`}
                          className="dark:text-gray-200"
                        >
                          {slot.active ? "Active" : "Inactive"}
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeRecurringSlot(slot.day)}
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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {availableWeekdays.length > 0 && (
          <Select onValueChange={(value: dayType) => addRecurringSlot(value)}>
            <SelectTrigger className="w-full sm:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Add weekday" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              {availableWeekdays.map((day) => (
                <SelectItem
                  key={day.value}
                  value={day.value}
                  className="dark:text-white dark:focus:bg-gray-600"
                >
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
}
