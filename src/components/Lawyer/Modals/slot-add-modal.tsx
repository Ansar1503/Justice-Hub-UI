"use client";

import { useEffect, useState } from "react";
import { AvailabilityForm } from "@/components/Lawyer/Forms/availability-form";
import { SlotSettingsForm } from "@/components/Lawyer/Forms/settings-form";
import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function SlotAddModal() {
  const { id } = useParams();
  const [step, setStep] = useState(Number(id) || 1);
  useEffect(() => {
    setStep(Number(id));
  }, [id]);
  const [slotSettings, setSlotSettings] = useState({
    title: "",
    duration: 30,
    buffer: 10,
    location: "online",
  });

  const handleSlotSettingsSubmit = (data: any) => {
    setSlotSettings(data);
    setStep(2);
  };

  const handleAvailabilitySubmit = (data: any) => {
    console.log("Slot settings:", slotSettings);
    console.log("Availability data:", data);
  };

  return (
    <div className="flex justify-center w-full h-full mt-10">
      <Card className="w-full max-w-[600px] bg-black text-white border-gray-800">
        {step === 1 ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Slot Settings
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                We just need some basic info to set up your slot.
                <br />
                You'll be able to edit this later.
              </CardDescription>
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  <div className="h-1 w-16 bg-white rounded"></div>
                  <div className="h-1 w-16 bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-400 mt-2">
                Step 1 of 2
              </div>
            </CardHeader>
            <SlotSettingsForm
              onSubmit={handleSlotSettingsSubmit}
              initialData={slotSettings}
            />
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Set your availability
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                Define ranges of time when you are available
                <br />
                You can customise all of this later in the availability page.
              </CardDescription>
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  <div className="h-1 w-16 bg-gray-700 rounded"></div>
                  <div className="h-1 w-16 bg-white rounded"></div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-400 mt-2">
                Step 2 of 2
              </div>
            </CardHeader>
            <AvailabilityForm onSubmit={handleAvailabilitySubmit} />
          </>
        )}
      </Card>
    </div>
  );
}
