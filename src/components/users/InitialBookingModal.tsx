"use client";

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
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EnhancedAvailabilityCalendar } from "./Calendar";
import { useAvailabilityData } from "../../hooks/useavailabilt";
import { formatTo12Hour } from "@/utils/utils";
import { slotSettings } from "@/types/types/SlotTypes";

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

  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useAvailabilityData(lawyerId, currentMonth);
  const canPayFromWallet = walletBalance >= consultationFee;
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "stripe">(
    canPayFromWallet ? "wallet" : "stripe"
  );

  useEffect(() => {
    if (date && onDateChange) onDateChange(date);
  }, [isOpen]);

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

  const handleSubmit = async () => {
    if (
      !lawyerAvailablity ||
      !date ||
      !timeSlot ||
      !reason.trim() ||
      !lawyerId ||
      !caseType ||
      !title
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
          title: title,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sessionId = response?.data?.id;
      stripe?.redirectToCheckout({
        sessionId,
      });
    } catch (error: any) {
      const message: string =
        error.response?.data?.error || "Booking failed! Try again.";
      toast.error(message);
    } finally {
      onSubmitEnd();
    }
  };

  const handleWalletPayment = async () => {
    if (
      !lawyerAvailablity ||
      !date ||
      !timeSlot ||
      !reason ||
      !caseType ||
      !title
    ) {
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
          title: title,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking successful! Paid from wallet.");
      navigate("/client/appointments");
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Booking failed! Try again.";
      toast.error(message);
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
          <div className="grid gap-2">
            <Label htmlFor="date" className="dark:text-gray-200">
              Select Date
            </Label>
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
                disabled={(date) => date < today || date > thirtyDaysFromNow}
                fromMonth={currentMonth}
                toMonth={thirtyDaysFromNow}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time" className="dark:text-gray-200">
              Select Time Slot
            </Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {!lawyerAvailablity || !date ? (
                  <SelectItem value="no-slots" disabled>
                    No available slots
                  </SelectItem>
                ) : timeSlots.length === 0 ? (
                  <SelectItem value="loading-slots" disabled>
                    Loading slots...
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
            <Label htmlFor="time" className="dark:text-gray-200">
              Slot Duration - {slotSettings?.slotDuration} minutes
            </Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title" className="dark:text-gray-200">
              Case Title
            </Label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!lawyerAvailablity}
              placeholder="e.g. Property dispute with landlord"
              className="px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="caseType" className="dark:text-gray-200">
              Select Case Type
            </Label>
            <Select
              value={caseType?.id || ""}
              onValueChange={(value) => {
                const selected = caseTypes?.find(
                  (ct: CaseTypestype) => ct.id.toString() === value
                );
                setCaseType(selected || null);
              }}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select a case type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                {!caseTypes || caseTypes.length === 0 ? (
                  <SelectItem
                    value="unavailable"
                    disabled
                    className="dark:text-gray-400 dark:focus:bg-gray-600"
                  >
                    No case type suitable for this lawyer
                  </SelectItem>
                ) : (
                  caseTypes.map((ct: CaseTypestype) => (
                    <SelectItem
                      key={ct.id}
                      value={ct.id.toString()}
                      className="dark:text-white dark:focus:bg-gray-600"
                    >
                      {ct.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason" className="dark:text-gray-200">
              Reason for Consultation
            </Label>
            <Textarea
              id="reason"
              value={reason}
              disabled={!lawyerAvailablity}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your legal issue"
              className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod" className="dark:text-gray-200">
              Select Payment Method
            </Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "wallet" | "stripe")
              }
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                {canPayFromWallet && (
                  <SelectItem
                    value="wallet"
                    className="dark:text-white dark:focus:bg-gray-600"
                  >
                    Wallet (₹{walletBalance})
                  </SelectItem>
                )}
                <SelectItem
                  value="stripe"
                  className="dark:text-white dark:focus:bg-gray-600"
                >
                  Pay with Stripe
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "wallet" && canPayFromWallet ? (
            <Button
              onClick={handleWalletPayment}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              disabled={
                !lawyerAvailablity ||
                !date ||
                !timeSlot ||
                !reason.trim() ||
                !caseType ||
                !title.trim()
              }
            >
              Pay from Wallet (₹{walletBalance})
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
              disabled={
                !lawyerAvailablity ||
                !date ||
                !timeSlot ||
                !reason.trim() ||
                !caseType ||
                !title ||
                paymentMethod != "stripe"
              }
            >
              {!lawyerAvailablity ||
              !date ||
              !timeSlot ||
              !reason ||
              !caseType ||
              !title ||
              paymentMethod != "stripe"
                ? "Submit Booking"
                : `Pay ₹${consultationFee}`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
