import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Phone, Upload, Clock } from "lucide-react";
import ReviewList from "@/components/users/ReviewList";
import ReviewForm from "@/components/users/forms/ReviewForm";
import { useParams } from "react-router-dom";
import {
  useFetchLawyerDetails,
  useFetchSlotsforClients,
} from "@/store/tanstack/queries";
import getVerificationBadge from "../ui/getVerificationBadge";
import LawyerNotAccessible from "./LawyerNotAccessible";
import { Skeleton } from "../ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
// import { useBookingMutation } from "@/store/tanstack/mutations/BookingMutation";
import { loadStripe } from "@stripe/stripe-js";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { store } from "@/store/redux/store";
import { toast } from "react-toastify";
import { Riple } from "react-loading-indicators";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { LawerDataType } from "@/types/types/Client.data.type";

export default function LawyerProfile() {
  const [lawyerDetails, setLawyerDetails] = useState<any>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [lawyerAvailablity, setLawyerAvailability] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");
  const { id } = useParams();
  const queryClient = useQueryClient();
  const lawyerDetailsCache = queryClient.getQueryData(["lawyerDetails", id]);
  // const {mutateAsync:bookingMutate} = useBookingMutation()
  const {
    data,
    refetch: refetchLawyerDetails,
    isLoading,
    isError,
  } = useFetchLawyerDetails(id || "");
  const lawyerDetailsData = data?.data;
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
  }, [id, lawyerDetailsData, refetchLawyerDetails, lawyerDetailsCache]);
  const { data: slotDetails, refetch: fetchSlots } = useFetchSlotsforClients(
    id || "",
    date || new Date()
  );
  const slotDetailsData: { isAvailable: boolean; slots: string[] | [] } =
    slotDetails?.data;
  useEffect(() => {
    if (slotDetailsData && Object.keys(slotDetailsData).length > 0) {
      if (slotDetailsData?.isAvailable && slotDetailsData?.slots.length > 0) {
        setTimeSlots(slotDetailsData.slots);
      }
      setLawyerAvailability(slotDetailsData.isAvailable);
    }
  }, [slotDetailsData]);

  // console.log("lawyeravailable", lawyerAvailablity);
  useEffect(() => {
    const fetchSlotDetails = async () => {
      if (id && date) {
        await fetchSlots();
      }
    };
    fetchSlotDetails();
  }, [id, date, fetchSlots]);

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be less than 10MB");
      setSelectedFile(null);
      return;
    }
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
    ];
    if (!validTypes.includes(file.type)) {
      setFileError("Only PDF, DOC, DOCX, and PNG files are allowed");
      setSelectedFile(null);
      return;
    }

    setFileError("");
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!lawyerAvailablity || !date || !timeSlot || !reason.trim() || !id) {
      return;
    }
    const stripe_pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!stripe_pk) {
      console.log("Stripe publishable key is not set");
      return;
    }
    setIsSubmitting(true);
    const stripe = await loadStripe(stripe_pk);
    const formData = new FormData();
    formData.append("lawyer_id", id);
    formData.append("date", date?.toISOString() || "");
    formData.append("timeSlot", timeSlot);
    formData.append("reason", reason);
    if (selectedFile) {
      formData.append("caseDocument", selectedFile);
    }

    const { token } = store.getState().Auth;
    let response;
    try {
      response = await axiosinstance.post(
        "/api/client/lawyer/slots/checkout-session/",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sessionId = response?.data?.id;
      const result = stripe?.redirectToCheckout({
        sessionId,
      });
      console.log("result", result);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Booking failed! Try again.";
      error.message = message;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProfileImageSkeleton = () => (
    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
      <Skeleton className="w-full h-full" />
    </div>
  );

  const BadgeSkeleton = () => <Skeleton className="h-6 w-20 rounded-full" />;

  const TextSkeleton = ({ width }: { width: string }) => (
    <Skeleton className={`h-5 ${width} rounded`} />
  );

  return (
    <div className="container mx-auto px-4 py-8 relative">
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
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg">
                    {isLoading ? (
                      <ProfileImageSkeleton />
                    ) : (
                      <Avatar className="w-full h-full flex items-center justify-center">
                        <AvatarImage
                          src={lawyerDetails?.profile_image}
                          alt={lawyerDetails?.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                        <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-lg rounded-full">
                          {lawyerDetails?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isLoading ? (
                        <TextSkeleton width="w-44" />
                      ) : (
                        <>
                          <CardTitle className="text-2xl font-bold dark:text-white">
                            {lawyerDetails?.name}
                          </CardTitle>
                          {getVerificationBadge(
                            lawyerDetails?.verification_status
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {isLoading
                        ? Array(3)
                            .fill(null)
                            .map((_, idx) => <BadgeSkeleton key={idx} />)
                        : lawyerDetails &&
                          lawyerDetails?.practice_areas.length &&
                          lawyerDetails.practice_areas.map((area: string) => (
                            <Badge
                              key={area}
                              variant="outline"
                              className="bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            >
                              {area}
                            </Badge>
                          ))}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="h-4 w-4 mr-2" />
                        {isLoading ? (
                          <TextSkeleton width="w-32" />
                        ) : (
                          <span>
                            {lawyerDetails?.experience || 0} years experience
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        {isLoading ? (
                          <TextSkeleton width="w-48" />
                        ) : (
                          <span>
                            {lawyerDetails?.Address
                              ? `${lawyerDetails.Address.city}, ${lawyerDetails.Address.state}, ${lawyerDetails.Address.pincode}`
                              : "N/A"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Mail className="h-4 w-4 mr-2" />
                        {isLoading ? (
                          <TextSkeleton width="w-52" />
                        ) : (
                          <span>{lawyerDetails?.email}</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Phone className="h-4 w-4 mr-2" />
                        {isLoading ? (
                          <TextSkeleton width="w-36" />
                        ) : (
                          <span>+91 {lawyerDetails?.mobile}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {isLoading ? (
                        <TextSkeleton width="w-24" />
                      ) : (
                        <>₹{lawyerDetails?.consultation_fee}</>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {isLoading ? (
                        <TextSkeleton width="w-28" />
                      ) : (
                        "Consultation Fee"
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4 w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white">
                          {isLoading ? (
                            <TextSkeleton width="w-16" />
                          ) : (
                            "Book Now"
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white">
                            Book a Consultation
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label
                              htmlFor="date"
                              className="dark:text-gray-200"
                            >
                              Select Date
                            </Label>
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(date) =>
                                date < today || date > thirtyDaysFromNow
                              }
                              fromMonth={today}
                              toMonth={thirtyDaysFromNow}
                              className="rounded-md border mx-auto dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="time"
                              className="dark:text-gray-200"
                            >
                              Select Time Slot
                            </Label>
                            <Select
                              value={timeSlot}
                              onValueChange={setTimeSlot}
                            >
                              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <SelectValue placeholder="Select a time slot" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                {!lawyerAvailablity ? (
                                  <SelectItem
                                    value="unavailable"
                                    className="dark:text-gray-400 dark:focus:bg-gray-600"
                                  >
                                    No available slots for this date
                                  </SelectItem>
                                ) : (
                                  timeSlots.map((slot) => (
                                    <SelectItem
                                      key={slot}
                                      value={slot}
                                      className="dark:text-white dark:focus:bg-gray-600"
                                    >
                                      {slot}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="reason"
                              className="dark:text-gray-200"
                            >
                              Reason for Consultation
                            </Label>
                            <Textarea
                              id="reason"
                              value={reason}
                              disabled={!lawyerAvailablity || isSubmitting}
                              onChange={(e) => setReason(e.target.value)}
                              placeholder="Briefly describe your legal issue"
                              className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="document"
                              className="dark:text-gray-200"
                            >
                              Upload Document (Optional)
                            </Label>
                            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                              <label
                                htmlFor="document-upload"
                                className="flex flex-col items-center justify-center cursor-pointer"
                              >
                                <Upload className="h-6 w-6 text-gray-400 dark:text-gray-300 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-300">
                                  {selectedFile
                                    ? selectedFile.name
                                    : "PDF, DOC, PNG (Max 10MB)"}
                                </span>
                                <input
                                  id="document-upload"
                                  type="file"
                                  disabled={!lawyerAvailablity || isSubmitting}
                                  className="hidden"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx,.png"
                                />
                              </label>
                              {fileError && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                                  {fileError}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={handleSubmit}
                            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
                            disabled={
                              !lawyerAvailablity ||
                              !date ||
                              !timeSlot ||
                              !reason ||
                              isSubmitting
                            }
                          >
                            {isSubmitting ? "Submitting..." : "Submit Booking"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="about">
                  <TabsList className="mb-4 dark:bg-gray-700">
                    <TabsTrigger
                      value="about"
                      className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
                    >
                      About
                    </TabsTrigger>
                    <TabsTrigger
                      value="specializations"
                      className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
                    >
                      Specializations
                    </TabsTrigger>
                    <TabsTrigger
                      value="credentials"
                      className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
                    >
                      Credentials
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="about">
                    <CardDescription className="text-base dark:text-gray-300">
                      {isLoading ? (
                        <div className="space-y-2">
                          <TextSkeleton width="w-full" />
                          <TextSkeleton width="w-full" />
                          <TextSkeleton width="w-3/4" />
                        </div>
                      ) : (
                        lawyerDetails?.description
                      )}
                    </CardDescription>
                  </TabsContent>
                  <TabsContent value="specializations">
                    <div className="space-y-2">
                      <h3 className="font-medium dark:text-white">
                        Areas of Expertise:
                      </h3>
                      {isLoading ? (
                        <div className="pl-5 space-y-2">
                          {Array(4)
                            .fill(null)
                            .map((_, idx) => (
                              <TextSkeleton key={idx} width="w-1/2" />
                            ))}
                        </div>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                          {lawyerDetails &&
                            lawyerDetails?.specialisation?.length > 0 &&
                            lawyerDetails.specialisation.map(
                              (spec: string, index: number) => (
                                <li key={index}>{spec}</li>
                              )
                            )}
                        </ul>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="credentials">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium dark:text-white">
                          Bar Council Number
                        </h3>
                        {isLoading ? (
                          <TextSkeleton width="w-40" />
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300">
                            {lawyerDetails?.barcouncil_number || "N/A"}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium dark:text-white">
                          Certificate of Practice Number
                        </h3>
                        {isLoading ? (
                          <TextSkeleton width="w-40" />
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300">
                            {lawyerDetails?.certificate_of_practice_number ||
                              "N/A"}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium dark:text-white">
                          Enrollment Certificate Number
                        </h3>
                        {isLoading ? (
                          <TextSkeleton width="w-40" />
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300">
                            {lawyerDetails?.enrollment_certificate_number ||
                              "N/A"}
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                {isLoading ? <TextSkeleton width="w-32" /> : "Client Reviews"}
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {isLoading ? (
                  <TextSkeleton width="w-64" />
                ) : (
                  "See what others are saying about this lawyer"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {isLoading ? (
                    <div className="space-y-6">
                      {Array(3)
                        .fill(null)
                        .map((_, idx) => (
                          <div
                            key={idx}
                            className="border p-4 rounded-lg dark:border-gray-700"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Skeleton className="w-10 h-10 rounded-full" />
                              <div className="space-y-1">
                                <TextSkeleton width="w-24" />
                                <div className="flex">
                                  {Array(5)
                                    .fill(null)
                                    .map((_, starIdx) => (
                                      <Skeleton
                                        key={starIdx}
                                        className="w-4 h-4 mr-1"
                                      />
                                    ))}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <TextSkeleton width="w-full" />
                              <TextSkeleton width="w-3/4" />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <ReviewList />
                  )}
                </div>
                <div>
                  {isLoading ? (
                    <div className="border p-4 rounded-lg dark:border-gray-700 space-y-4">
                      <TextSkeleton width="w-32" />
                      <div className="space-y-2">
                        <TextSkeleton width="w-full" />
                        <TextSkeleton width="w-full" />
                        <TextSkeleton width="w-3/4" />
                      </div>
                      <div className="h-8 w-full">
                        <Skeleton className="h-full w-full rounded" />
                      </div>
                    </div>
                  ) : (
                    <ReviewForm id={lawyerDetails?.user_id} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
