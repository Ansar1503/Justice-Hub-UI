"use client";

import type React from "react";
import { useState } from "react";
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
import { useFetchLawyerDetails } from "@/store/tanstack/queries";
import getVerificationBadge from "../ui/getVerificationBadge";
import LawyerNotAccessible from "./LawyerNotAccessible";
import { Skeleton } from "../ui/skeleton";

export default function LawyerProfile() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const { id } = useParams();
  const { data, isLoading, isError } = useFetchLawyerDetails(id || "");
  const lawyerDetails = data?.data;

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const timeSlots = [
    "09:00-09:30 AM",
    "09:30-10:00 AM",
    "10:00-10:30 AM",
    "10:30-11:00 AM",
    "11:00-11:30 AM",
    "11:30-12:00 PM",
    "12:00-12:30 PM",
    "12:30-01:00 PM",
    "02:00-02:30 PM",
    "02:30-03:00 PM",
    "03:00-03:30 PM",
    "03:30-04:00 PM",
    "04:00-04:30 PM",
    "04:30-05:00 PM",
    "05:00-05:30 PM",
    "05:30-06:00 PM",
  ];

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

  const handleSubmit = () => {
    console.log({ date, timeSlot, reason, selectedFile });
    setDate(new Date());
    setTimeSlot("");
    setReason("");
    setSelectedFile(null);
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
      {(isError || !lawyerDetails) && !isLoading && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-100 flex justify-center items-center">
          <LawyerNotAccessible />
        </div>
      )}
      <div>
        {/* Profile Section */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg">
                  {isLoading ? (
                    <ProfileImageSkeleton />
                  ) : (
                    <img
                      src={lawyerDetails?.profile_image}
                      alt={lawyerDetails?.name}
                      className="w-[128px] h-[128px] object-cover"
                    />
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
                        {isLoading ? <TextSkeleton width="w-16" /> : "Book Now"}
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
                          <Label htmlFor="date" className="dark:text-gray-200">
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
                          <Label htmlFor="time" className="dark:text-gray-200">
                            Select Time Slot
                          </Label>
                          <Select value={timeSlot} onValueChange={setTimeSlot}>
                            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                              {timeSlots.map((slot) => (
                                <SelectItem
                                  key={slot}
                                  value={slot}
                                  className="dark:text-white dark:focus:bg-gray-600"
                                >
                                  {slot}
                                </SelectItem>
                              ))}
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
                          disabled={!date || !timeSlot || !reason}
                        >
                          Submit Booking
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
  );
}
