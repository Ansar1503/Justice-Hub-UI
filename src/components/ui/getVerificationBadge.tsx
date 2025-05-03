import { AlertCircle, Check, Clock, X } from "lucide-react";
import { Badge } from "./badge";
import { VerificationStatus } from "@/types/types/Client.data.type";

const getVerificationBadge = (status: VerificationStatus) => {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 h-6">
          <Check className="w-3 h-3 mr-1" /> Verified
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">
          <X className="w-3 h-3 mr-1" /> Rejected
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-600">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    case "requested":
      return (
        <Badge variant="secondary">
          <AlertCircle className="w-3 h-3 mr-1" /> Requested
        </Badge>
      );
  }
};

export default getVerificationBadge;
