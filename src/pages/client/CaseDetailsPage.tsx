import { Link, useParams } from "react-router-dom";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetchCaseDetails } from "@/store/tanstack/Queries/Cases";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CaseDetailsHeadCard from "@/components/Case/CaseDetailsHeadCard";
import CaseAppointmentsTab from "@/components/Case/CaseAppointmentsTab";
import { useAppSelector } from "@/store/redux/Hook";
import CaseSessionsTab from "@/components/Case/CaseSessionsTab";

export default function CaseDetailsPage() {
  const { id } = useParams();
  const { user } = useAppSelector((s) => s.Auth);
  const { data: CaseDetails, isLoading } = useFetchCaseDetails(id);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="space-y-6 flex-1 p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/${user?.role}/cases`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cases
              </Link>
            </Button>
          </div>

          {/* No Case Found */}
          {!isLoading && !CaseDetails && (
            <Card>
              <CardHeader>
                <CardTitle>No details found</CardTitle>
                <CardDescription>
                  The case you are looking for does not exist or may have been
                  removed.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Case Details */}
          {CaseDetails && <CaseDetailsHeadCard CaseDetails={CaseDetails} />}
          {/* Case Details Tabs */}
          <Tabs defaultValue="appointments" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="appointments">
              <CaseAppointmentsTab id={CaseDetails?.id} />
            </TabsContent>

            <TabsContent value="sessions">
              {" "}
              <CaseSessionsTab id={CaseDetails?.id} />{" "}
            </TabsContent>
            <TabsContent value="documents"></TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
