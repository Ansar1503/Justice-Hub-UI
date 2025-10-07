import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SpecializationsType } from "@/types/types/SpecializationType";
import { Skeleton } from "../ui/skeleton";

interface LawyerTabsProps {
  lawyerDetails: any;
  isLoading: boolean;
}

const TextSkeleton = ({ width }: { width: string }) => (
  <Skeleton className={`h-5 ${width} rounded`} />
);

export function LawyerTabs({ lawyerDetails, isLoading }: LawyerTabsProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="pt-6">
        <Tabs defaultValue="about">
          <TabsList className="mb-4 dark:bg-gray-700">
            <TabsTrigger
              value="about"
              className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="specializations"
              className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
            >
              Specializations
            </TabsTrigger>
            <TabsTrigger
              value="credentials"
              className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
            >
              Credentials
            </TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <CardDescription className="text-base dark:text-gray-300">
              {isLoading ? (
                <div className="space-y-2">
                  <TextSkeleton width="w-full" />
                  <TextSkeleton width="w-full" />
                  <TextSkeleton width="w-3/4" />
                </div>
              ) : (
                lawyerDetails?.description
              )}
            </CardDescription>
          </TabsContent>
          <TabsContent value="specializations">
            <div className="space-y-2">
              <h3 className="font-medium dark:text-white">
                Areas of Expertise:
              </h3>
              {isLoading ? (
                <div className="pl-5 space-y-2">
                  {Array(4)
                    .fill(null)
                    .map((_, idx) => (
                      <TextSkeleton key={idx} width="w-1/2" />
                    ))}
                </div>
              ) : (
                <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                  {lawyerDetails &&
                    lawyerDetails?.specialisation?.length > 0 &&
                    lawyerDetails.specialisation.map(
                      (spec: SpecializationsType, index: number) => (
                        <li key={index}>{spec.name}</li>
                      )
                    )}
                </ul>
              )}
            </div>
          </TabsContent>
          <TabsContent value="credentials">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium dark:text-white">
                  Bar Council Number
                </h3>
                {isLoading ? (
                  <TextSkeleton width="w-40" />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    {lawyerDetails?.barcouncil_number || "N/A"}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-medium dark:text-white">
                  Certificate of Practice Number
                </h3>
                {isLoading ? (
                  <TextSkeleton width="w-40" />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    {lawyerDetails?.certificate_of_practice_number || "N/A"}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-medium dark:text-white">
                  Enrollment Certificate Number
                </h3>
                {isLoading ? (
                  <TextSkeleton width="w-40" />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    {lawyerDetails?.enrollment_certificate_number || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
