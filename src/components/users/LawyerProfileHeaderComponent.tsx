import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import type { PracticeAreaType } from "@/types/types/PracticeAreaType";
import getVerificationBadge from "../ui/getVerificationBadge";
import { Skeleton } from "../ui/skeleton";

interface LawyerProfileHeaderProps {
  lawyerDetails: any;
  isLoading: boolean;
  children?: React.ReactNode;
}

const ProfileImageSkeleton = () => (
  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
    <Skeleton className="w-full h-full" />
  </div>
);

const BadgeSkeleton = () => <Skeleton className="h-6 w-20 rounded-full" />;

const TextSkeleton = ({ width }: { width: string }) => (
  <Skeleton className={`h-5 ${width} rounded`} />
);

export function LawyerProfileHeader({
  lawyerDetails,
  isLoading,
  children,
}: LawyerProfileHeaderProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg">
            {isLoading ? (
              <ProfileImageSkeleton />
            ) : (
              <Avatar className="w-full h-full flex items-center justify-center">
                <AvatarImage
                  src={lawyerDetails?.profile_image || "/placeholder.svg"}
                  alt={lawyerDetails?.name}
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-lg rounded-full">
                  {lawyerDetails?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <TextSkeleton width="w-44" />
              ) : (
                <>
                  <CardTitle className="text-2xl font-bold dark:text-white">
                    {lawyerDetails?.name}
                  </CardTitle>
                  {getVerificationBadge(lawyerDetails?.verification_status)}
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {isLoading
                ? Array(3)
                    .fill(null)
                    .map((_, idx) => <BadgeSkeleton key={idx} />)
                : lawyerDetails &&
                  lawyerDetails?.practice_areas.length &&
                  lawyerDetails.practice_areas.map((area: PracticeAreaType) => (
                    <Badge
                      key={area.id}
                      variant="outline"
                      className="bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    >
                      {area.name}
                    </Badge>
                  ))}
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Clock className="h-4 w-4 mr-2" />
                {isLoading ? (
                  <TextSkeleton width="w-32" />
                ) : (
                  <span>{lawyerDetails?.experience || 0} years experience</span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="h-4 w-4 mr-2" />
                {isLoading ? (
                  <TextSkeleton width="w-48" />
                ) : (
                  <span>
                    {lawyerDetails?.Address
                      ? `${lawyerDetails?.Address.city || "n/a"}, ${
                          lawyerDetails.Address.state || "n/a"
                        }, ${lawyerDetails.Address.pincode || "n/a"}`
                      : "N/A"}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Mail className="h-4 w-4 mr-2" />
                {isLoading ? (
                  <TextSkeleton width="w-52" />
                ) : (
                  <span>{lawyerDetails?.email}</span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Phone className="h-4 w-4 mr-2" />
                {isLoading ? (
                  <TextSkeleton width="w-36" />
                ) : (
                  <span>+91 {lawyerDetails?.mobile}</span>
                )}
              </div>
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {isLoading ? (
                <TextSkeleton width="w-24" />
              ) : (
                <>₹{lawyerDetails?.consultation_fee}</>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? <TextSkeleton width="w-28" /> : "Consultation Fee"}
            </div>
            {children}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
