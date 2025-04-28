"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Eye,
  X,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast";
import { LawerDataType } from "@/types/types/Client.data.type";

interface LawyerVerificationModalProps {
  lawyer: LawerDataType;
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

  const handleVerificationStatusChange = (
    status: LawerDataType["verification_status"]
  ) => {
    if (status === "rejected") {
      setIsRejectionDialogOpen(true);
      return;
    }

    // toast({
    //   title: "Verification status updated",
    //   description: `${lawyer.name}'s verification status has been set to ${status}.`,
    // });

    onClose();
  };

  const handleRejectionSubmit = () => {
    if (!rejectionReason.trim()) {
      // toast({
      //   title: "Rejection reason required",
      //   description: "Please provide a reason for rejection.",
      //   variant: "destructive",
      // });
      return;
    }

    // toast({
    //   title: "Verification rejected",
    //   description: `${lawyer.name}'s verification has been rejected.`,
    // });

    setIsRejectionDialogOpen(false);
    onClose();
  };

  const handlePreviewDocument = (document: { name: string; url: string }) => {
    setPreviewDocument(document);
  };

  const renderStatusBadge = (status: LawerDataType["verification_status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Lawyer Details</span>
              {renderStatusBadge(lawyer.verification_status)}
            </DialogTitle>
            <DialogDescription>
              Review {lawyer.name}'s profile and verification details
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="verification"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="verification">
                Verification Details
              </TabsTrigger>
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
            </TabsList>

            {/* Verification Details Tab */}
            <TabsContent value="verification" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lawyer.description && (
                    <div>
                      <Label className="text-muted-foreground">
                        Description
                      </Label>
                      <p className="mt-1">{lawyer.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bar Council Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">
                        Bar Council Number
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer.bar_council_number}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Bar Council ID
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 border rounded-md p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">
                              {lawyer.bar_council_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handlePreviewDocument({ name: "", url: "" })
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        File size: {(10000 / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enrollment Certificate */}
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Certificate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">
                        Enrollment Certificate Number
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer.enrollment_certificate_number}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Enrollment Certificate ID
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 border rounded-md p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">
                              {lawyer.enrollment_certificate_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handlePreviewDocument({ name: "", url: "" })
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        File size: {(100000 / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate of Practice */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificate of Practice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">
                        Certificate of Practice Number
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer.certificate_of_practice_number || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Certificate of Practice
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 border rounded-md p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">
                              {lawyer.certificate_of_practice_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handlePreviewDocument({ name: "", url: "" })
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        File size: {(10000 / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
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
                        {lawyer.practice_areas.map((area) => (
                          <Badge key={area} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Specialisation
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {lawyer.specialisation.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Experience
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer.experience} years
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Consultation Fee
                      </Label>
                      <p className="mt-1 font-medium">
                        ₹{lawyer.consultation_fee}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Fields */}
              {/* {lawyer.custom_fields &&
                Object.keys(lawyer.custom_fields).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(verificationData.custom_fields).map(
                          ([key, value]) => (
                            <div key={key}>
                              <Label className="text-muted-foreground">
                                {key === "custom-1"
                                  ? "Primary Court"
                                  : key === "custom-2"
                                  ? "Languages"
                                  : key === "custom-3"
                                  ? "Bar Admission Date"
                                  : key}
                              </Label>
                              <p className="mt-1 font-medium">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value.toString()}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )} */}
            </TabsContent>

            {/* Profile Information Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="mt-1 font-medium">{lawyer.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Email Address
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer.email}{" "}
                        {lawyer.is_verified && <Badge>verified</Badge>}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Phone Number
                      </Label>
                      <p className="mt-1 font-medium">{lawyer.mobile}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Joined Date
                      </Label>
                      <p className="mt-1 font-medium">
                        {lawyer.createdAt
                          ? new Date(lawyer.createdAt).toLocaleDateString(
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

              {/* <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Rating</Label>
                      <p className="mt-1 font-medium">{lawyer.rating}/5</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Cases Handled
                      </Label>
                      <p className="mt-1 font-medium">{lawyer.cases_handled}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Success Rate
                      </Label>
                      <p className="mt-1 font-medium">78%</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center">
            {lawyer.verification_status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleVerificationStatusChange("rejected")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleVerificationStatusChange("verified")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
            {lawyer.verification_status !== "pending" && (
              <Button
                variant="outline"
                onClick={() => handleVerificationStatusChange("pending")}
              >
                Reset to Pending
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog
        open={isRejectionDialogOpen}
        onOpenChange={setIsRejectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {lawyer.name}'s
              verification.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectionSubmit}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog
        open={!!previewDocument}
        onOpenChange={() => setPreviewDocument(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Document Preview</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPreviewDocument(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>{previewDocument?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            <img
              src={previewDocument?.url || "/placeholder.svg"}
              alt="Document Preview"
              className="max-h-[60vh] object-contain border rounded-md"
            />
          </div>
          <DialogFooter>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
