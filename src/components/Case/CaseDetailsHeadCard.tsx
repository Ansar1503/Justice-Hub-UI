import { formatDate } from "@/utils/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { AggregatedCasesData } from "@/types/types/Case";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { useUpdateCaseDetailsMutation } from "@/store/tanstack/mutations/CaseDocumentMutation";

type Props = {
  CaseDetails: AggregatedCasesData;
};

const MIN_TITLE = 5;
const MAX_SUMMARY = 200;
const MIN_ESTIMATE = 500;

export default function CaseDetailsHeadCard({ CaseDetails }: Props) {
  const [editable, setEditable] = useState(false);
  const [form, setForm] = useState({
    title: CaseDetails?.title || "",
    status: CaseDetails?.status || "open",
    estimatedValue: CaseDetails?.estimatedValue || 0,
    nextHearing: CaseDetails?.nextHearing
      ? new Date(CaseDetails.nextHearing).toISOString().split("T")[0]
      : "",
    summary: CaseDetails?.summary || "",
  });
  const { mutate: updateCaseDetails, isPending: updateCaseDetailsLoading } = useUpdateCaseDetailsMutation()

  const [errors, setErrors] = useState({
    title: "",
    estimatedValue: "",
    summary: "",
    nextHearing: "",
  });

  const validate = () => {
    const newErrors: any = {};

    if (!form.title || form.title.trim().length < MIN_TITLE) {
      newErrors.title = `Title must be at least ${MIN_TITLE} characters`;
    }

    if (form.summary && form.summary.length > MAX_SUMMARY) {
      newErrors.summary = `Summary cannot exceed ${MAX_SUMMARY} characters`;
    }

    if (form.estimatedValue && Number(form.estimatedValue) < MIN_ESTIMATE) {
      newErrors.estimatedValue = `Estimated value must be greater than ₹${MIN_ESTIMATE}`;
    }
    if (form.nextHearing) {
      const selected = new Date(form.nextHearing);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(selected.getTime())) {
        newErrors.nextHearing = "Invalid hearing date";
      } else if (selected < today) {
        newErrors.nextHearing = "Next hearing date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {
    if (!validate()) return;
    try {
      await updateCaseDetails({
        caseId: CaseDetails.id,
        title: form.title,
        status: form.status,
        summary: form.summary,
        estimatedValue: form.estimatedValue || 0,
        nextHearing: form.nextHearing ? form.nextHearing : undefined,
      })
    } catch (error) {

    }
    setEditable(false);
  };

  const handleCancel = () => {
    setForm({
      title: CaseDetails?.title,
      status: CaseDetails.status,
      estimatedValue: CaseDetails?.estimatedValue || 0,
      nextHearing: CaseDetails?.nextHearing
        ? new Date(CaseDetails.nextHearing).toISOString().split("T")[0]
        : "",
      summary: CaseDetails?.summary || "",
    });
    setErrors({
      title: "",
      estimatedValue: "",
      summary: "",
      nextHearing: "",
    });
    setEditable(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {editable ? (
                <div className="w-72">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className={cn(errors.title && "border-red-500")}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
              ) : (
                <CardTitle className="text-2xl">{CaseDetails?.title}</CardTitle>
              )}

              {!editable && <CaseStatusBadge status={CaseDetails?.status} />}
            </div>

            {editable ? (
              <div>
                <Label>Summary</Label>
                <Textarea
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                  className={cn(errors.summary && "border-red-500")}
                />
                {errors.summary && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.summary}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {form.summary.length}/{MAX_SUMMARY}
                </p>
              </div>
            ) : (
              <CardDescription className="text-base max-w-3xl">
                {CaseDetails?.summary}
              </CardDescription>
            )}
          </div>

          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">Case ID</p>
            <p className="font-mono text-sm">
              #{CaseDetails.id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">

          {/* Client Name */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Client</p>
            <p className="font-medium">{CaseDetails?.clientDetails?.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Primary Lawyer</p>
            <p className="font-medium">{CaseDetails?.lawyerDetails?.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Case Type</p>
            <p className="font-medium">{CaseDetails?.caseTypeDetails?.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Estimated Value</p>
            {editable ? (
              <>
                <Input
                  type="number"
                  value={form.estimatedValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      estimatedValue: Number(e.target.value),
                    })
                  }
                  className={cn(errors.estimatedValue && "border-red-500")}
                />
                {errors.estimatedValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.estimatedValue}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium text-accent">
                {!CaseDetails?.estimatedValue
                  ? "Amount Not Estimated"
                  : `₹${CaseDetails?.estimatedValue}`}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            {editable ? (
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    status: v as AggregatedCasesData["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="onhold">On Hold</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="font-medium capitalize">{CaseDetails?.status}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Created Date</p>
            <p className="font-medium">
              {formatDate(new Date(CaseDetails?.createdAt))}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Next Hearing</p>
            {editable ? (
              <>
                <Input
                  type="date"
                  value={form.nextHearing}
                  onChange={(e) =>
                    setForm({ ...form, nextHearing: e.target.value })
                  }
                  className={cn(errors.nextHearing && "border-red-500")}
                />
                {errors.nextHearing && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nextHearing}
                  </p>
                )}
              </>
            ) : (
              <p className="font-medium">
                {!CaseDetails?.nextHearing
                  ? "Next hearing not fixed"
                  : formatDate(new Date(CaseDetails?.nextHearing))}
              </p>
            )}
          </div>

          <div className="ml-auto flex gap-2 items-center">
            {!editable ? (
              <Button variant="default" onClick={() => setEditable(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button disabled={updateCaseDetailsLoading} onClick={handleSave}>Save</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
