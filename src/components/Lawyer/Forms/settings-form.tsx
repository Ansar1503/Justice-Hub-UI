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

export function SlotSettingsForm() {
  const { id } = useParams();

  const [formData, setFormData] = useState<slotSettings>({
    slotDuration: "30",
    maxDaysInAdvance: "30",
    autoConfirm: false,
  });

  const { mutateAsync, isPending } = UpdateScheduleSettingsMutation();
  const queryClient = useQueryClient();
  const slotSettings: slotSettings | undefined = queryClient.getQueryData([
    "schedule",
    "settings",
  ]);

  useEffect(() => {
    if (slotSettings) {
      if (Object.keys(slotSettings).length > 0) {
        setFormData({
          slotDuration: slotSettings?.slotDuration.toString(),
          maxDaysInAdvance: slotSettings?.maxDaysInAdvance.toString(),
          autoConfirm: slotSettings?.autoConfirm,
        });
      }
    }
  }, [slotSettings]);

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
        <div className="bg-gray-900 p-6 rounded-lg space-y-6">
          <div className="space-y-2">
            <Label htmlFor="slotDuration" className="text-gray-200">
              Slot Duration
            </Label>
            <Select
              value={formData.slotDuration}
              onValueChange={(value) => handleChange("slotDuration", value)}
            >
              <SelectTrigger
                id="slotDuration"
                className="bg-gray-800 border-gray-700 text-white"
              >
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {["15", "30", "45", "60", "90"].map((val) => (
                  <SelectItem key={`slotDuration-${val}`} value={val}>
                    {val} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDaysInAdvance" className="text-gray-200">
              Max Days In Advance
            </Label>
            <Select
              value={formData?.maxDaysInAdvance}
              onValueChange={(value) => handleChange("maxDaysInAdvance", value)}
            >
              <SelectTrigger
                id="maxDaysInAdvance"
                className="bg-gray-800 border-gray-700 text-white"
              >
                <SelectValue placeholder="Select advance notice" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
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
              className="data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <Label htmlFor="autoConfirm" className="ml-2 text-gray-200">
              Auto confirm
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          disabled={isPending}
          type="submit"
          className="w-full bg-gray-200 text-black hover:bg-white"
        >
          {isPending? "Saving..." : id ? "Next Step" : "Save Settings"}
        </Button>
      </CardFooter>
    </form>
  );
}
