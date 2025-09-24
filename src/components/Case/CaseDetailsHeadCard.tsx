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

type Props = {
  CaseDetails: AggregatedCasesData;
};

export default function CaseDetailsHeadCard({ CaseDetails }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">{CaseDetails?.title}</CardTitle>
              <CaseStatusBadge status={CaseDetails?.status} />
            </div>
            <CardDescription className="text-base max-w-3xl">
              {CaseDetails?.summary}
            </CardDescription>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">Case ID</p>
            <p className="font-mono text-sm">
              #
              {CaseDetails.id
                ? CaseDetails.id.slice(-6).toUpperCase()
                : `CASE-ID}`}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <p className="font-medium text-accent">
              {!CaseDetails?.estimatedValue
                ? "Amount Not Estimated"
                : CaseDetails?.estimatedValue}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Created Date</p>
            <p className="font-medium">
              {!CaseDetails?.createdAt
                ? "N/A"
                : formatDate(new Date(CaseDetails?.createdAt))}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Next Hearing</p>
            <p className="font-medium">
              {!CaseDetails?.nextHearing
                ? "Next hearing not fixed"
                : formatDate(new Date(CaseDetails?.nextHearing))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
