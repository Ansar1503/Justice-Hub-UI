"use client"

// import { useState } from "react";
// import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import ScheduleVisualization from "@/components/Lawyer/ScheduleVisualisation";
// import BlockedDates from "@/components/Lawyer/BlockedDates";
import OverrideDates from "@/components/Lawyer/OverrideDates"
import Navbar from "./layout/Navbar"
import Footer from "./layout/Footer"
import Sidebar from "./layout/Sidebar"
// import { useFetchSlotSettings } from "@/store/tanstack/queries";
import { SlotSettingsForm } from "@/components/Lawyer/Forms/settings-form"
import { AvailabilityForm } from "@/components/Lawyer/Forms/availability-form"

export default function LawyerSchedulePage() {
  // const today = new Date(new Date().setHours(0, 0, 0, 0));
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(
  //   new Date()
  // );
  // const [availabilityUpdated, setAvailabilityUpdated] = useState(false);
  // const { data } = useFetchSlotSettings();
  // const dateAvailable = data?.data?.maxDaysInAdvance;
  // const maxDate = new Date(today);
  // maxDate.setDate(today.getDate() + dateAvailable);

 

  return (
    <div className="bg-brandCream dark:bg-slate-950 min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row md:justify-evenly md:gap-16 ">
        <Sidebar />
        <div className="flex-grow py-8">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Manage Your Slots</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Set your available time slots for client consultations. Clients will only be able to book appointments
            during these times.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className=" dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Schedule Settings</CardTitle>
                  <CardDescription className="dark:text-gray-300">Configure your appointment settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <SlotSettingsForm />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Manage Availability</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Set your available time slots and override dates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="availability" className="w-full">
                    <TabsList className="mb-4 dark:bg-gray-700">
                      <TabsTrigger
                        value="availability"
                        className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
                      >
                        Availability
                      </TabsTrigger>
                      <TabsTrigger
                        value="overrides"
                        className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
                      >
                        Date Overrides
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="availability">
                      <AvailabilityForm />
                    </TabsContent>

                    <TabsContent value="overrides">
                      <OverrideDates  />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
