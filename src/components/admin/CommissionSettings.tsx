import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cog, Percent, Briefcase, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { SummaryTile } from "./CommissioinSummary";
import { useAddCommissionSettingsMutation } from "@/store/tanstack/mutations/CommissionMutation";
import { useFetchCommissionSettings } from "@/store/tanstack/Queries/CommissionQuery";

function clampPercent(n: number) {
  return Math.max(0, Math.min(40, Math.round(n)));
}

export default function CommissionSettings() {
  const [initialCommission, setInitialCommission] = useState<number>(20);
  const [followupCommission, setFollowupCommission] = useState<number>(10);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    isPending: addingCommissionSettings,
    mutateAsync: addCommissionSettings,
  } = useAddCommissionSettingsMutation();
  const { data: CommissionSettings } = useFetchCommissionSettings();
  useEffect(() => {
    if (
      CommissionSettings?.initialCommission &&
      CommissionSettings.followupCommission
    ) {
      setInitialCommission(CommissionSettings.initialCommission);
      setFollowupCommission(CommissionSettings.followupCommission);
    }
  }, [CommissionSettings]);
  const handleSave = async () => {
    setError(null);

    if (followupCommission > initialCommission - 5) {
      setError(
        "Follow-up commission should be at least 5% less than the initial commission."
      );
      return;
    }

    if (initialCommission > 40 || followupCommission > 40) {
      setError("Commission cannot exceed 40%.");
      return;
    }

    try {
      await addCommissionSettings({
        followupCommission: followupCommission,
        initialCommission: initialCommission,
        id: CommissionSettings?.id,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaved(false);
      console.log("error adding commisssion settings ", error);
    }
  };

  const initialAdminAmt = Math.round((1000 * initialCommission) / 100);
  const initialLawyerAmt = 1000 - initialAdminAmt;
  const followAdminAmt = Math.round((1000 * followupCommission) / 100);
  const followLawyerAmt = 1000 - followAdminAmt;

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <SettingRow
          icon={<Briefcase className="h-4 w-4" aria-hidden="true" />}
          title="Initial Booking Commission"
          value={initialCommission}
          onValueChange={(v) => setInitialCommission(clampPercent(v))}
          description="Applies to the first-time booking between client and lawyer."
        />

        <SettingRow
          icon={<Cog className="h-4 w-4" aria-hidden="true" />}
          title="Follow-up Booking Commission"
          value={followupCommission}
          onValueChange={(v) => setFollowupCommission(clampPercent(v))}
          description="Applies to subsequent follow-up sessions with the same lawyer."
        />
      </div>

      {error && (
        <Alert variant="destructive" className="border border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={addingCommissionSettings}
          className="min-w-28"
        >
          {addingCommissionSettings ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <Alert className="border border-border">
            <AlertTitle className="text-foreground">Saved</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Commission settings updated successfully.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" aria-hidden="true" />
            Example on ₹1000 booking
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            See how the commission affects payouts for initial and follow-up
            sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <SummaryTile
            label="Initial booking"
            adminPercent={initialCommission}
            adminAmount={initialAdminAmt}
            lawyerAmount={initialLawyerAmt}
          />
          <SummaryTile
            label="Follow-up booking"
            adminPercent={followupCommission}
            adminAmount={followAdminAmt}
            lawyerAmount={followLawyerAmt}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  value,
  onValueChange,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  onValueChange: (v: number) => void;
  description: string;
}) {
  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground text-base">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            {icon}
            <span className="sr-only">{title}</span>
          </span>
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={title} className="text-foreground">
              Current value
            </Label>
            <span className="text-sm font-medium text-foreground">
              {value}%
            </span>
          </div>
          <Slider
            id={title}
            value={[value]}
            min={0}
            max={40}
            step={1}
            onValueChange={(vals) => onValueChange(vals[0] ?? 0)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <Label htmlFor={`${title}-input`} className="text-foreground">
            Adjust (%)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${title}-input`}
              type="number"
              inputMode="numeric"
              min={0}
              max={40}
              value={value}
              onChange={(e) => onValueChange(Number(e.target.value || 0))}
              className="w-24"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
