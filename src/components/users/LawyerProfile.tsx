import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  useFetchLawyerDetails,
  useFetchLawyerSlotSettings,
  useFetchSlotsforClients,
} from "@/store/tanstack/queries";
import { useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { store } from "@/store/redux/store";
import { Riple } from "react-loading-indicators";
import type { PracticeAreaType } from "@/types/types/PracticeAreaType";
import { useFechCaseTypeByPractice } from "@/store/tanstack/Queries/CasetypeQuery";
import { useFetchWalletByUser } from "@/store/tanstack/Queries/walletQueries";
import LawyerNotAccessible from "./LawyerNotAccessible";
import Reviews from "./Reviews";
import { LawyerProfileHeader } from "./LawyerProfileHeaderComponent";
import { LawyerTabs } from "./LawyerTabsComponent";
import { BookingModalEnhanced } from "./InitialBookingModal";
import { FollowUpBookingModalEnhanced } from "./FollowupBookingModal";

export default function LawyerProfile() {
  const [lawyerDetails, setLawyerDetails] = useState<any>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lawyerAvailablity, setLawyerAvailability] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const lawyerDetailsCache = queryClient.getQueryData(["lawyerDetails", id]);

  const { data: slotSettingsData, refetch: refetchslotSettings } =
    useFetchLawyerSlotSettings(id || "");
  const slotSettings = slotSettingsData?.data;

  const {
    data,
    refetch: refetchLawyerDetails,
    isLoading,
    isError,
  } = useFetchLawyerDetails(id || "");
  const { data: walletData } = useFetchWalletByUser();
  const walletBalance = walletData?.balance || 0;

  const lawyerDetailsData = data?.data;
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      if (lawyerDetailsCache && Object.keys(lawyerDetailsCache).length > 0) {
        setLawyerDetails(lawyerDetailsCache);
      } else if (
        lawyerDetailsData &&
        Object.keys(lawyerDetailsData).length > 0
      ) {
        setLawyerDetails(lawyerDetailsData);
      } else {
        if (id) {
          await refetchLawyerDetails();
        }
      }
    };
    fetchLawyerDetails();
  }, [
    id,
    lawyerDetailsData,
    refetchLawyerDetails,
    lawyerDetailsCache,
    refetchslotSettings,
  ]);

  const { data: slotDetails, refetch: fetchSlots } = useFetchSlotsforClients(
    id || "",
    selectedDate
  );
  useEffect(() => {
    fetchSlots();
  }, [selectedDate, fetchSlots]);
  useEffect(() => {
    const { token } = store.getState().Auth;
    async function deleteSession() {
      if (!sessionId) return;
      await axiosinstance.delete(
        `/api/client/lawyer/slots/session/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refetchslotSettings();
      fetchSlots();
    }
    deleteSession();
  }, [sessionId, fetchSlots, refetchslotSettings]);

  const slotDetailsData = slotDetails?.data;
  const { data: caseTypes } = useFechCaseTypeByPractice(
    lawyerDetails?.practice_areas?.map((p: PracticeAreaType) => p.id)
  );
  useEffect(() => {
    if (slotDetailsData && Object.keys(slotDetailsData).length > 0) {
      if (slotDetailsData?.isAvailable && slotDetailsData?.slots.length > 0) {
        setTimeSlots(slotDetailsData.slots);
      }
      setLawyerAvailability(slotDetailsData.isAvailable);
    }
  }, [slotDetailsData]);

  useEffect(() => {
    const fetchSlotDetails = async () => {
      if (id) {
        await fetchSlots();
        await refetchslotSettings();
      }
    };
    fetchSlotDetails();
  }, [id, fetchSlots, refetchslotSettings]);

  const handleDateChange = async (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);
      setTimeSlots([]);
      setLawyerAvailability(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      {isSubmitting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10">
            <Riple color="#050505" size="medium" text="" textColor="" />
          </div>
        </div>
      )}

      <div className={isSubmitting ? "blur-sm pointer-events-none" : ""}>
        {(isError || !lawyerDetails) && !isLoading && (
          <div className="absolute inset-0 z-50 bg-black bg-opacity-100 flex justify-center items-center">
            <LawyerNotAccessible />
          </div>
        )}
        <div>
          <div className="lg:col-span-2">
            <LawyerProfileHeader
              lawyerDetails={lawyerDetails}
              isLoading={isLoading}
            >
              <div className="flex flex-col gap-2 mt-4 w-full md:w-auto">
                <BookingModalEnhanced
                  lawyerId={id || ""}
                  lawyerAvailablity={lawyerAvailablity}
                  timeSlots={timeSlots}
                  slotSettings={slotSettings}
                  caseTypes={caseTypes || []}
                  walletBalance={walletBalance}
                  consultationFee={lawyerDetails?.consultation_fee || 0}
                  onSubmitStart={() => setIsSubmitting(true)}
                  onSubmitEnd={() => setIsSubmitting(false)}
                  onDateChange={handleDateChange}
                >
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white">
                    Book New Case
                  </Button>
                </BookingModalEnhanced>

                <FollowUpBookingModalEnhanced
                  caseTypes={caseTypes || []}
                  lawyerId={id || ""}
                  lawyerAvailablity={lawyerAvailablity}
                  timeSlots={timeSlots}
                  slotSettings={slotSettings}
                  walletBalance={walletBalance}
                  consultationFee={lawyerDetails?.consultation_fee || 0}
                  onSubmitStart={() => setIsSubmitting(true)}
                  onSubmitEnd={() => setIsSubmitting(false)}
                  onDateChange={handleDateChange}
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
                    Book Follow-Up
                  </Button>
                </FollowUpBookingModalEnhanced>
              </div>
            </LawyerProfileHeader>

            <div className="mt-6">
              <LawyerTabs lawyerDetails={lawyerDetails} isLoading={isLoading} />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Reviews sessoin_id="" user_id={lawyerDetails?.user_id} />
        </div>
      </div>
    </div>
  );
}
