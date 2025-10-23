import { useEffect, useState } from "react";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { toast } from "react-hot-toast";

interface TimeRange {
  start: string;
  end: string;
  availableSlots: number;
}

interface DateAvailability {
  date: string;
  isAvailable: boolean;
  timeRanges: TimeRange[];
}

interface CalendarAvailabilityResponse {
  lawyerId: string;
  month: string;
  availableDates: DateAvailability[];
  slotDuration: number;
  maxDaysInAdvance: number;
}

export function useAvailabilityData(lawyerId: string, month?: Date) {
  const [data, setData] = useState<DateAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!lawyerId) return;

      setIsLoading(true);
      setError(null);

      try {
        const targetMonth = month || new Date();
        const monthString = `${targetMonth.getFullYear()}-${String(
          targetMonth.getMonth() + 1
        ).padStart(2, "0")}`;
        const response = await axiosinstance.get<CalendarAvailabilityResponse>(
          `/api/client/lawyers/${lawyerId}/availability/calendar`,
          {
            params: { month: monthString },
          }
        );
        setData(response.data.availableDates);
      } catch (err: any) {
        const message =
          err.response?.data?.error || "Failed to fetch availability";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [lawyerId, month]);

  return { data, isLoading, error };
}
