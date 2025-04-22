import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";

export function VerifiedBadge() {
  return (
    <Badge className="bg-blue-600 items-center hover:bg-blue-600  gap-1 text-sm flex w-24 ">
      <BadgeCheck className="h-4 w-4 text-white " />
      <span className="text-white">Verified</span>
    </Badge>
  );
}
