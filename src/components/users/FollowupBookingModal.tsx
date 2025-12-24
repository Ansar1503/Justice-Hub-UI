import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadStripe } from "@stripe/stripe-js";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { store } from "@/store/redux/store";
import { useNavigate } from "react-router-dom";
import { useAvailabilityData } from "../../hooks/useavailabilt";
import { EnhancedAvailabilityCalendar } from "./Calendar";
import { formatTo12Hour } from "@/utils/utils";
import type { Casetype } from "@/types/types/Case";
import type { CaseTypestype } from "@/types/types/CaseType";
import { FetchAmountPayable } from "@/utils/api/services/clientServices";
import { slotSettings } from "@/types/types/SlotTypes";
import { toast } from "sonner";

interface FollowUpBookingModalEnhancedProps {
  caseTypes: CaseTypestype[];
  lawyerId: string;
  lawyerAvailablity: boolean;
  timeSlots: string[];
  slotSettings?: slotSettings;
  walletBalance: number;
  consultationFee: number;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
  onDateChange?: (date: Date | undefined) => void;
  children: React.ReactNode;
}

export function FollowUpBookingModalEnhanced({
  caseTypes,
  lawyerId,
  lawyerAvailablity,
  timeSlots,
  slotSettings,
  walletBalance,
  consultationFee,
  onSubmitStart,
  onSubmitEnd,
  onDateChange,
  children,
}: FollowUpBookingModalEnhancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedCase, setSelectedCase] = useState<Casetype | null>(null);
  const [cases, setCases] = useState<Casetype[]>([]);
  const [timeSlot, setTimeSlot] = useState<string>();
  const [reason, setReason] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const navigate = useNavigate();
  const [priceDetails, setPriceDetails] = useState<null | {
    amountPayable: number;
    subscriptionDiscountAmount: number;
    followUpDiscountAmount: number;
  }>(null);

  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useAvailabilityData(lawyerId, currentMonth);

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "stripe">(
    "stripe"
  );

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(
    today.getDate() +
      (slotSettings?.maxDaysInAdvance
        ? Number(slotSettings.maxDaysInAdvance)
        : 30)
  );

  useEffect(() => {
    const fetchCases = async () => {
      const { token } = store.getState().Auth;
      try {
        const response = await axiosinstance.get(
          `/api/client/cases/caseTypes/ids`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { caseTypeIds: caseTypes.map((c) => c.id) },
          }
        );
        setCases(response.data || []);
      } catch (error) {
        console.log("fetch cases", error);
      }
    };

    if (lawyerId && isOpen) {
      fetchCases();
    }
  }, [caseTypes, isOpen]);

  const fetchAmountPayable = async () => {
    if (!selectedCase || !date || !timeSlot || !reason.trim()) {
      toast.error("Fill all fields before continuing.");
      return;
    }

    setIsPriceLoading(true);
    setPriceDetails(null);

    try {
      const data = await FetchAmountPayable({
        type: "follow-up",
        lawyerId,
      });

      setPriceDetails(data);
    } catch (error: any) {
      toast.error(
        typeof error.response?.data?.error === "string"
          ? error.response?.data?.error
          : "Failed to get amount."
      );
    } finally {
      setIsPriceLoading(false);
    }
  };

  const handleStripePay = async () => {
    if (!priceDetails) return;

    onSubmitStart();
    const { token } = store.getState().Auth;

    try {
      const stripe_pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      const stripe = await loadStripe(stripe_pk);

      const response = await axiosinstance.post(
        "/api/client/lawyer/slots/checkout-session/follow-up",
        {
          lawyer_id: lawyerId,
          date: date?.toISOString(),
          timeSlot,
          reason,
          duration: slotSettings?.slotDuration,
          caseId: selectedCase?.id,
          amount: priceDetails.amountPayable,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      stripe?.redirectToCheckout({ sessionId: response.data.id });
    } catch (e: any) {
      console.log(e);
      toast.error(
        typeof e.response?.data?.error === "string"
          ? e.response?.data?.error
          : "Stripe payment failed."
      );
    } finally {
      onSubmitEnd();
    }
  };

  const handleWalletPay = async () => {
    if (!priceDetails) return;

    if (walletBalance < priceDetails.amountPayable) {
      toast.error("Insufficient wallet balance.");
      return;
    }

    onSubmitStart();
    const { token } = store.getState().Auth;

    try {
      await axiosinstance.post(
        "/api/client/lawyer/slots/book-wallet/follow-up",
        {
          lawyer_id: lawyerId,
          date: date?.toISOString(),
          timeSlot,
          reason,
          duration: slotSettings?.slotDuration,
          caseId: selectedCase?.id,
          amount: priceDetails.amountPayable,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Follow-up booked successfully!");
      navigate("/client/appointments");
    } catch (e: any) {
      console.log(e);
      toast.error(
        typeof e.response?.data?.error === "string"
          ? e.response?.data?.error
          : "Wallet payment failed."
      );
    } finally {
      onSubmitEnd();
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setTimeSlot(undefined);
    onDateChange?.(newDate ?? undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] scrollbar-hide overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Follow-Up Consultation
          </DialogTitle>
          <DialogDescription>
            Select a case, date, and time for your follow-up.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Select Case</Label>
            <Select
              value={selectedCase?.id || ""}
              onValueChange={(value) => {
                const found = cases.find((c) => c.id === value);
                setSelectedCase(found ?? null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your case" />
              </SelectTrigger>

              <SelectContent>
                {cases.length === 0 ? (
                  <SelectItem value="no-follow-ups" disabled>
                    No follow-up cases found
                  </SelectItem>
                ) : (
                  cases.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Select Date</Label>

            {isLoadingAvailability ? (
              <div>Loading availability…</div>
            ) : (
              <EnhancedAvailabilityCalendar
                scheduleSettings={slotSettings}
                onMonthChange={setCurrentMonth}
                selected={date}
                onSelect={handleDateSelect}
                availabilityData={availabilityData}
                disabled={(d) => d < today || d > thirtyDaysFromNow}
                fromMonth={currentMonth}
                toMonth={thirtyDaysFromNow}
                className="dark:bg-gray-700"
              />
            )}
          </div>

          <div className="grid gap-2">
            <Label>Select Time Slot</Label>

            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>

              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {formatTo12Hour(slot)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What would you like to discuss?"
              className="dark:bg-gray-700"
            />
          </div>

          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as "wallet" | "stripe")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="stripe">Pay with Stripe</SelectItem>

                {walletBalance > 0 && (
                  <SelectItem value="wallet">
                    Wallet (₹{walletBalance})
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {!priceDetails && (
            <Button
              onClick={fetchAmountPayable}
              className="w-full bg-blue-600 mt-3"
              disabled={
                !selectedCase ||
                !date ||
                !timeSlot ||
                !reason.trim() ||
                !lawyerAvailablity
              }
            >
              {isPriceLoading ? "Calculating..." : "Book Now"}{" "}
              {!selectedCase
                ? "(select a case)"
                : !date
                ? "(select a date)"
                : !timeSlot
                ? "(select a time)"
                : !reason.trim()
                ? "(add a reason)"
                : !lawyerAvailablity
                ? "(lawyer not available)"
                : ""}
            </Button>
          )}

          {priceDetails && (
            <div className="p-4 mt-4 border rounded-md dark:bg-gray-700">
              <p className="flex justify-between text-sm">
                <span>Consultation Fee</span>
                <span>₹{consultationFee}</span>
              </p>

              {priceDetails.followUpDiscountAmount > 0 && (
                <p className="flex justify-between text-sm text-green-400">
                  <span>Follow-up Discount</span>
                  <span>-₹{priceDetails.followUpDiscountAmount}</span>
                </p>
              )}

              {priceDetails.subscriptionDiscountAmount > 0 && (
                <p className="flex justify-between text-sm text-green-400">
                  <span>Subscription Discount</span>
                  <span>-₹{priceDetails.subscriptionDiscountAmount}</span>
                </p>
              )}

              <hr className="my-2" />

              <p className="flex justify-between font-semibold text-lg">
                <span>Total Payable</span>
                <span>₹{priceDetails.amountPayable}</span>
              </p>
            </div>
          )}

          {priceDetails && paymentMethod === "stripe" && (
            <Button
              className="w-full bg-emerald-600 mt-3"
              onClick={handleStripePay}
            >
              Pay ₹{priceDetails.amountPayable}
            </Button>
          )}

          {priceDetails &&
            paymentMethod === "wallet" &&
            walletBalance >= priceDetails.amountPayable && (
              <Button
                className="w-full bg-blue-600 mt-3"
                onClick={handleWalletPay}
              >
                Pay from Wallet (₹{priceDetails.amountPayable})
              </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
