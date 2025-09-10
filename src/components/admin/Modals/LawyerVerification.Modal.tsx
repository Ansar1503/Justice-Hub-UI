"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LawerDataType } from "@/types/types/Client.data.type";
import { useChangeLawyerVerificationStatus } from "@/store/tanstack/mutations";
import { DocumentPreview } from "../DocumentPreview";
import { RejectLawyerModal } from "./RejectModal";
import { AggregatedLawyerProfile } from "@/types/types/LawyerTypes";

interface LawyerVerificationModalProps {
  lawyer: AggregatedLawyerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function LawyerVerificationModal({
  lawyer,
  isOpen,
  onClose,
}: LawyerVerificationModalProps) {
  const [activeTab, setActiveTab] = useState("verification");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const { isPending: statusChangePending, mutateAsync } =
    useChangeLawyerVerificationStatus();

  const [statusAction, setStatusAction] = useState<"approve" | "reject" | null>(
    null
  );
  const documents = [
    {
      name: "Bar Council Certificate",
      url: lawyer?.verificationDocuments?.barCouncilCertificate || "",
      number: lawyer?.verificationDetails?.barCouncilNumber || "N/A",
    },
    {
      name: "Enrollment Certificate",
      url: lawyer.verificationDocuments?.enrollmentCertificate || "",
      number: lawyer?.verificationDetails?.enrollmentCertificateNumber || "N/A",
    },
    {
      name: "Certificate of Practice",
      url: lawyer?.verificationDocuments?.certificateOfPractice || "",
      number: lawyer?.verificationDetails?.certificateOfPracticeNumber || "N/A",
    },
  ];

  const handleVerificationStatusChange = async (
    status: LawerDataType["verification_status"]
  ) => {
    if (status === "rejected") {
      setIsRejectionDialogOpen(true);
      return;
    }

    try {
      setStatusAction("approve");
      await mutateAsync({ user_id: lawyer.userId, status });
      onClose();
    } catch (error) {
      console.error("Failed to change verification status:", error);
    } finally {
      setStatusAction(null);
    }
  };

  const handleRejectionSubmit = async (user_id: string) => {
    if (!rejectionReason.trim()) {
      return;
    }

    try {
      setStatusAction("reject");
      await mutateAsync({
        user_id,
        status: "rejected",
        rejectReason: rejectionReason,
      });
      setIsRejectionDialogOpen(false);
      onClose();
    } catch (error) {
      console.error("Failed to reject verification:", error);
    } finally {
      setStatusAction(null);
    }
  };

  const handlePreviewDocument = (document: { name: string; url: string }) => {
    if (document.url) {
      const extension = document.url.split(".").pop()?.toLowerCase();
      if (extension === "pdf") {
        window.open(document.url, "_blank");
      } else {
        setPreviewDocument(document);
      }
    }
  };

  const handleDownloadDocument = (url: string, name: string) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}.${url.split(".").pop() || "pdf"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderStatusBadge = (status: LawerDataType["verification_status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 mr-5 mt-3">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 mr-5 mt-3">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1 mr-5 mt-3">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "requested":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1 mr-5 mt-3">
            <AlertCircle className="h-3 w-3" />
            Requested
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Lawyer Details</span>
              {renderStatusBadge(
                lawyer?.verificationDetails?.verificationStatus
              )}
            </DialogTitle>
            <DialogDescription>
              Review {lawyer?.personalDetails?.name}'s profile and verification
              details
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="verification"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="verification">
                Verification Details
              </TabsTrigger>
              <TabsTrigger value="professional">
                professional Information
              </TabsTrigger>
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
            </TabsList>

            <TabsContent value="verification" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lawyer?.ProfessionalDetails?.description && (
                    <div>
                      <Label className="text-muted-foreground">
                        Description
                      </Label>
                      <p className="mt-1">
                        {lawyer?.ProfessionalDetails?.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {documents.map((doc) => (
                <Card key={doc.name}>
                  <CardHeader>
                    <CardTitle>{doc.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">
                          {doc.name} Number
                        </Label>
                        <p className="mt-1 font-medium">{doc.number}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          {doc.name}
                        </Label>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 border rounded-md p-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate">
                                {doc.url ? doc.name : "Not uploaded"}
                              </span>
                            </div>
                            {doc.url && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePreviewDocument(doc)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadDocument(doc.url, doc.name)
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">
                        Practice Areas
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(lawyer?.ProfessionalDetails?.practiceAreas &&
                          lawyer?.ProfessionalDetails?.practiceAreas?.length >
                            0 &&
                          lawyer?.ProfessionalDetails?.practiceAreas?.map(
                            (area: any) => (
                              <Badge key={area._id} variant="secondary">
                                {area.name}
                              </Badge>
                            )
                          )) || <span>N/A</span>}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Specialisation
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(lawyer?.ProfessionalDetails?.specialisations &&
                          lawyer?.ProfessionalDetails?.specialisations?.length >
                            0 &&
                          lawyer?.ProfessionalDetails?.specialisations?.map(
                            (spec: any) => (
                              <Badge key={spec._id} variant="secondary">
                                {spec.name}
                              </Badge>
                            )
                          )) || <span>N/A</span>}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Experience
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer?.ProfessionalDetails?.experience || "N/A"} years
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Consultation Fee
                      </Label>
                      <p className="mt-1 font-medium">
                        ₹{lawyer?.ProfessionalDetails?.consultationFee || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="mt-1 font-medium">
                        {lawyer?.personalDetails?.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Email Address
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer?.personalDetails?.email}{" "}
                        {lawyer?.personalDetails?.isVerified}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Phone Number
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer?.personalDetails?.mobile || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Joined Date
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer?.createdAt
                          ? new Date(lawyer?.createdAt)?.toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center">
            {lawyer?.verificationDetails?.verificationStatus ===
              "requested" && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  disabled={statusChangePending}
                  onClick={() => handleVerificationStatusChange("rejected")}
                >
                  {statusChangePending && statusAction === "reject" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  variant="default"
                  disabled={statusChangePending}
                  onClick={() => handleVerificationStatusChange("verified")}
                >
                  {statusChangePending && statusAction === "approve" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <RejectLawyerModal
        handleRejectionSubmit={handleRejectionSubmit}
        isRejectionDialogOpen={isRejectionDialogOpen}
        lawyer={lawyer}
        rejectionReason={rejectionReason}
        setIsRejectionDialogOpen={setIsRejectionDialogOpen}
        setRejectionReason={setRejectionReason}
        statusChangePending={statusChangePending}
      />
      <DocumentPreview
        handleDownloadDocument={handleDownloadDocument}
        previewDocument={previewDocument}
        setPreviewDocument={setPreviewDocument}
      />
    </>
  );
}
