"use client";

import { useState } from "react";
// import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import AvailabilityForm from "@/components/Lawyer/Forms/AvailabiltyForm";
import RecurringAvailability from "@/components/Lawyer/RecurringAvailabilty";
// import ScheduleVisualization from "@/components/Lawyer/ScheduleVisualisation";
import BlockedDates from "@/components/Lawyer/BlockedDates";
import SettingsForm from "@/components/Lawyer/Forms/SettingsForm";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";
import { useFetchSlotSettings } from "@/store/tanstack/queries";

export default function LawyerSchedulePage() {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(
  //   new Date()
  // );
  const [availabilityUpdated, setAvailabilityUpdated] = useState(false);
  const { data } = useFetchSlotSettings();
  const dateAvailable = data?.data?.maxDaysInAdvance;
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + dateAvailable);

  const handleAvailabilityUpdate = () => {
    setAvailabilityUpdated(!availabilityUpdated);
  };

  return (
    <div className="bg-brandCream dark:bg-slate-950 min-h-screen">
      <Navbar />
      <div className="flex-grow container">
        <div className="flex flex-col md:flex-row md:justify-evenly md:gap-16 ">
          <Sidebar />
          <div className="flex-grow py-8">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">
              Manage Your Availability
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Set your available time slots for client consultations. Clients
              will only be able to book appointments during these times.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                {/* <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">
                      Select Date
                    </CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Choose a date to manage availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < today || date > maxDate}
                      fromMonth={today}
                      toMonth={maxDate}
                      className="rounded-md border mx-auto dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </CardContent>
                </Card> */}

                <Card className=" dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">
                      Schedule Settings
                    </CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Configure your appointment settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SettingsForm onUpdate={handleAvailabilityUpdate} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">
                      Manage Availability
                    </CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Set your available time slots and blocked dates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="availability" className="w-full">
                      <TabsList className="mb-4 dark:bg-gray-700">
                        {/* <TabsTrigger
                          value="daily"
                          className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
                        >
                          Daily Slots
                        </TabsTrigger> */}
                        <TabsTrigger
                          value="availability"
                          className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
                        >
                          Recurring Schedule
                        </TabsTrigger>
                        <TabsTrigger
                          value="blocked"
                          className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
                        >
                          Blocked Dates
                        </TabsTrigger>
                      </TabsList>

                      {/* <TabsContent value="daily">
                        <AvailabilityForm
                          selectedDate={selectedDate}
                          onUpdate={handleAvailabilityUpdate}
                        />
                      </TabsContent> */}

                      <TabsContent value="availability">
                        <RecurringAvailability
                          onUpdate={handleAvailabilityUpdate}
                        />
                      </TabsContent>

                      <TabsContent value="blocked">
                        <BlockedDates onUpdate={handleAvailabilityUpdate} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              {/* <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">
                    Your Schedule
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Overview of your availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleVisualization
                    selectedDate={selectedDate}
                    refreshTrigger={availabilityUpdated}
                  />
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
