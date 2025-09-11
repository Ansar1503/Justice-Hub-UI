import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, AlertCircle } from "lucide-react";
import { useFetchLawyersVerificationDetails } from "@/store/tanstack/Queries/lawyersQueries";
import { useAppSelector } from "@/store/redux/Hook";

export default function LawyerVerificationDetails() {
  const { user } = useAppSelector((s) => s.Auth);
  const { data: verification } = useFetchLawyersVerificationDetails(
    user?.user_id
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "requested":
        return "default";
      case "verified":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };
  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "requested":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "";
    }
  };
  const handleDocumentView = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Verification Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verification Information */}
        <div className="grid gap-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">
                Bar Council Number
              </dt>
              <dd className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {verification?.barCouncilNumber}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">
                Enrollment Certificate Number
              </dt>
              <dd className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {verification?.enrollmentCertificateNumber}
              </dd>
            </div>

            <div className="space-y-1 md:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">
                Certificate of Practice Number
              </dt>
              <dd className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {verification?.certificateOfPracticeNumber}
              </dd>
            </div>
          </dl>
        </div>

        {/* Verification Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Verification Status
          </h4>
          <Badge
            variant={getStatusBadgeVariant(
              verification?.verificationStatus || ""
            )}
            className={`capitalize ${getStatusBadgeClass(
              verification?.verificationStatus || ""
            )}`}
          >
            {verification?.verificationStatus}
          </Badge>
        </div>

        {/* Rejection Reason Alert */}
        {verification?.verificationStatus === "rejected" &&
          verification?.rejectReason && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Rejection Reason:</strong> {verification?.rejectReason}
              </AlertDescription>
            </Alert>
          )}

        {/* Documents Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Documents
          </h4>
          <div className="flex  gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleDocumentView(
                  verification?.documents.barCouncilCertificate
                )
              }
              className="flex items-center gap-2 bg-transparent"
              disabled={!verification?.documents.barCouncilCertificate}
            >
              <FileText className="h-4 w-4" />
              View Bar Council Certificate
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleDocumentView(
                  verification?.documents.certificateOfPractice
                )
              }
              className="flex items-center gap-2 bg-transparent"
              disabled={!verification?.documents.certificateOfPractice}
            >
              <FileText className="h-4 w-4" />
              View Certificate of Practice
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleDocumentView(
                  verification?.documents.enrollmentCertificate
                )
              }
              className="flex items-center gap-2 bg-transparent"
              disabled={!verification?.documents.enrollmentCertificate}
            >
              <FileText className="h-4 w-4" />
              View Enrollment Certificate
            </Button>
          </div>
        </div>

        {/* Timestamps */}
        {/* Timestamps */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {verification?.createdAt
                ? formatDate(verification.createdAt)
                : "—"}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{" "}
              {verification?.updatedAt
                ? formatDate(verification.updatedAt)
                : "—"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
