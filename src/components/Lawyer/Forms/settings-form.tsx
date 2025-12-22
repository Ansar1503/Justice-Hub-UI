import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useParams } from "react-router-dom";
import { UpdateScheduleSettingsMutation } from "@/store/tanstack/mutations/slotMutations";
import { slotSettings } from "@/types/types/SlotTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchSlotSettings } from "@/store/tanstack/queries";
import { ResponseType } from "@/types/types/LoginResponseTypes";

export function SlotSettingsForm() {
  const { id } = useParams();

  const [formData, setFormData] = useState<slotSettings>({
    slotDuration: "30",
    maxDaysInAdvance: "30",
    autoConfirm: false,
  });

  const { mutateAsync, isPending } = UpdateScheduleSettingsMutation();
  const { data, refetch } = useFetchSlotSettings();
  const slotSettingsData = data?.data;
  const queryClient = useQueryClient();
  const cacheData: (ResponseType & { data: slotSettings }) | undefined =
    queryClient.getQueryData(["schedule", "settings"]);
  const cachedSlotSettings = cacheData?.data;
  useEffect(() => {
    if (cachedSlotSettings && Object.keys(cachedSlotSettings).length > 0) {
      setFormData({
        slotDuration: cachedSlotSettings?.slotDuration.toString(),
        maxDaysInAdvance: cachedSlotSettings?.maxDaysInAdvance.toString(),
        autoConfirm: cachedSlotSettings.autoConfirm,
      });
    } else if (slotSettingsData && Object.keys(slotSettingsData).length > 0) {
      setFormData({
        slotDuration: slotSettingsData?.slotDuration.toString(),
        maxDaysInAdvance: slotSettingsData?.maxDaysInAdvance.toString(),
        autoConfirm: slotSettingsData.autoConfirm,
      });
    } else {
      refetch();
    }
  }, [cachedSlotSettings, slotSettingsData, refetch]);

  // useEffect(() => {
  //   if (slotSettings) {
  //     if (Object.keys(slotSettings).length > 0) {
  //       setFormData({
  //         slotDuration: slotSettings?.slotDuration?.toString(),
  //         maxDaysInAdvance: slotSettings?.maxDaysInAdvance?.toString(),
  //         autoConfirm: slotSettings?.autoConfirm,
  //       });
  //     }
  //   }
  // }, [slotSettings]);

  const handleChange = (field: string, value: string | boolean) => {
    if (field === "slotDuration" || field === "maxDaysInAdvance") {
      if (value === "" || value === null || value === undefined) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent>
        <div className="rounded-lg space-y-6">
          <div className="space-y-2">
            <Label htmlFor="slotDuration" className="">
              Slot Duration
            </Label>
            <Select
              value={formData.slotDuration}
              onValueChange={(value) => handleChange("slotDuration", value)}
            >
              <SelectTrigger
                id="slotDuration"
                className=""
              >
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="">
                {["15", "30", "45", "60", "90"].map((val) => (
                  <SelectItem key={`slotDuration-${val}`} value={val}>
                    {val} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDaysInAdvance" className="">
              Max Days In Advance
            </Label>
            <Select
              value={formData?.maxDaysInAdvance}
              onValueChange={(value) => handleChange("maxDaysInAdvance", value)}
            >
              <SelectTrigger
                id="maxDaysInAdvance"
                className=""
              >
                <SelectValue placeholder="Select advance notice" />
              </SelectTrigger>
              <SelectContent className="">
                {["15", "30", "45", "60"].map((val) => (
                  <SelectItem key={`maxDaysInAdvance-${val}`} value={val}>
                    {val} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <Switch
              id="autoConfirm"
              checked={formData.autoConfirm}
              onCheckedChange={(checked) =>
                handleChange("autoConfirm", checked)
              }
            />
            <Label htmlFor="autoConfirm" className="ml-2">
              Auto confirm
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          disabled={isPending}
          type="submit"
          className="w-full"
        >
          {isPending ? "Saving..." : id ? "Next Step" : "Save Settings"}
        </Button>
      </CardFooter>
    </form>
  );
}
