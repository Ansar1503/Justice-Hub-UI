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
import type { CaseTypestype } from "@/types/types/CaseType";
import { loadStripe } from "@stripe/stripe-js";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { store } from "@/store/redux/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EnhancedAvailabilityCalendar } from "./Calendar";
import { useAvailabilityData } from "../../hooks/useavailabilt";
import { formatTo12Hour } from "@/utils/utils";
import { slotSettings } from "@/types/types/SlotTypes";
import { FetchAmountPayable } from "@/utils/api/services/clientServices";

interface BookingModalEnhancedProps {
  lawyerId: string;
  lawyerAvailablity: boolean;
  timeSlots: string[];
  slotSettings?: slotSettings;
  caseTypes: CaseTypestype[];
  walletBalance: number;
  consultationFee: number;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
  onDateChange?: (date: Date | undefined) => void;
  children: React.ReactNode;
}

export function BookingModalEnhanced({
  lawyerId,
  lawyerAvailablity,
  timeSlots,
  slotSettings,
  caseTypes,
  walletBalance,
  consultationFee,
  onSubmitStart,
  onSubmitEnd,
  onDateChange,
  children,
}: BookingModalEnhancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [caseType, setCaseType] = useState<CaseTypestype | null>(null);
  const [title, setTitle] = useState<string>("");
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

  // useEffect(() => {
  //   if (date && onDateChange) onDateChange(date);
  // }, [isOpen]);

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(
    today.getDate() +
      (slotSettings?.maxDaysInAdvance
        ? Number(slotSettings.maxDaysInAdvance)
        : 30)
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setTimeSlot(undefined);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const fetchAmountPayable = async () => {
    if (!date || !timeSlot || !reason.trim() || !caseType || !title.trim()) {
      toast.error("Please fill all fields before proceeding.");
      return;
    }

    setIsPriceLoading(true);
    setPriceDetails(null);

    try {
      const data = await FetchAmountPayable({
        type: "consultation",
        lawyerId,
      });
      setPriceDetails(data);
    } catch (error: any) {
      toast.error(
        typeof error.response?.data?.error === "string"
          ? error.response?.data?.error
          : "Failed to fetch price details."
      );
    } finally {
      setIsPriceLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !lawyerAvailablity ||
      !date ||
      !timeSlot ||
      !reason.trim() ||
      !caseType ||
      !title ||
      !priceDetails
    ) {
      return;
    }

    const stripe_pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!stripe_pk) {
      console.error("Stripe publishable key not found");
      return;
    }

    onSubmitStart();
    const stripe = await loadStripe(stripe_pk);
    const { token } = store.getState().Auth;
    try {
      const response = await axiosinstance.post(
        "/api/client/lawyer/slots/checkout-session/",
        {
          lawyer_id: lawyerId,
          date: date?.toISOString(),
          timeSlot,
          reason,
          duration: slotSettings?.slotDuration,
          caseTypeId: caseType.id,
          title,
          amount: priceDetails.amountPayable,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = response?.data?.id;
      stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      toast.error(
        typeof error.response?.data?.error === "string"
          ? error.response?.data?.error
          : "Booking failed! Try again."
      );
    } finally {
      onSubmitEnd();
    }
  };

  const handleWalletPayment = async () => {
    if (
      !lawyerAvailablity ||
      !date ||
      !timeSlot ||
      !reason.trim() ||
      !caseType ||
      !title ||
      !priceDetails
    ) {
      return;
    }

    if (walletBalance < priceDetails.amountPayable) {
      toast.error("Insufficient wallet balance.");
      return;
    }

    onSubmitStart();
    const { token } = store.getState().Auth;

    try {
      await axiosinstance.post(
        "/api/client/lawyer/slots/book-wallet",
        {
          lawyer_id: lawyerId,
          date: date?.toISOString(),
          timeSlot,
          reason,
          duration: slotSettings?.slotDuration,
          caseTypeId: caseType.id,
          title,
          amount: priceDetails.amountPayable,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking successful! Paid from wallet.");
      navigate("/client/appointments");
    } catch (error: any) {
      console.log(error);
      toast.error(
        typeof error.response?.data?.error === "string"
          ? error.response?.data?.error
          : "Booking failed! Try again."
      );
    } finally {
      onSubmitEnd();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto scrollbar-hide dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            Book a Consultation
          </DialogTitle>
          <DialogDescription>
            Select a date with available slots and choose your preferred time.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* DATE */}
          <div className="grid gap-2">
            <Label className="dark:text-gray-200">Select Date</Label>
            {isLoadingAvailability ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading availability...
              </div>
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
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            )}
          </div>

          <div className="grid gap-2">
            <Label className="dark:text-gray-200">Select Time Slot</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>

              <SelectContent>
                {!lawyerAvailablity || !date ? (
                  <SelectItem value="no-slots" disabled>
                    No available slots
                  </SelectItem>
                ) : (
                  timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {formatTo12Hour(slot)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="dark:text-gray-200">Case Title</Label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Property dispute with landlord"
              className="px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="dark:text-gray-200">Select Case Type</Label>

            <Select
              value={caseType?.id || ""}
              onValueChange={(value) => {
                const selected = caseTypes.find(
                  (ct) => ct.id.toString() === value
                );
                setCaseType(selected || null);
              }}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select a case type" />
              </SelectTrigger>

              <SelectContent>
                {caseTypes.map((ct) => (
                  <SelectItem
                    key={ct.id}
                    value={ct.id.toString()}
                    className="dark:text-white"
                  >
                    {ct.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="dark:text-gray-200">
              Reason for Consultation
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your legal issue"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* PAYMENT METHOD */}
          <div className="grid gap-2">
            <Label className="dark:text-gray-200">Select Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as "wallet" | "stripe")}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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
              className="w-full mt-4 bg-blue-600 dark:bg-blue-700"
              disabled={
                !lawyerAvailablity ||
                !date ||
                !timeSlot ||
                !reason.trim() ||
                !caseType ||
                !title.trim()
              }
            >
              {isPriceLoading ? "Calculating..." : "Book Now"}
            </Button>
          )}

          {priceDetails && (
            <div className="p-4 rounded-md border dark:border-gray-600 dark:bg-gray-800 mt-4">
              <p className="flex justify-between text-sm mb-2">
                <span className="">Consultation Fee</span>
                <span className="">₹{consultationFee}</span>
              </p>

              {priceDetails.followUpDiscountAmount > 0 && (
                <p className="flex justify-between text-sm mb-2">
                  <span className="">Follow-up Discount</span>
                  <span className="text-green-400">
                    -₹{priceDetails.followUpDiscountAmount}
                  </span>
                </p>
              )}

              {priceDetails.subscriptionDiscountAmount > 0 && (
                <p className="flex justify-between text-sm mb-2">
                  <span className="">Subscription Discount</span>
                  <span className="text-green-400">
                    -₹{priceDetails.subscriptionDiscountAmount}
                  </span>
                </p>
              )}

              <hr className="my-2 border-gray-600" />

              <p className="flex justify-between font-semibold text-lg">
                <span>Total Payable</span>
                <span>₹{priceDetails.amountPayable}</span>
              </p>
            </div>
          )}

          {priceDetails && paymentMethod === "stripe" && (
            <Button
              onClick={handleSubmit}
              className="w-full mt-3 bg-emerald-600"
            >
              Pay ₹{priceDetails.amountPayable}
            </Button>
          )}

          {priceDetails &&
            paymentMethod === "wallet" &&
            walletBalance >= priceDetails.amountPayable && (
              <Button
                onClick={handleWalletPayment}
                className="w-full mt-3 bg-blue-600"
              >
                Pay from Wallet (₹{priceDetails.amountPayable})
              </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
