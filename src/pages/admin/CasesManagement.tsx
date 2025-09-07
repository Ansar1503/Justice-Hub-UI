import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "./layout/admin.layout";
import SpecializationsCard from "@/components/admin/specializations/SpecializationsCard";
import PracticeAreasCard from "@/components/admin/PracticeAreas/PracticeAreasCard";
import CaseTypeCard from "@/components/admin/CaseTypes/CaseTypeCard";

export default function CaseManagement() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg- p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Legal Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-pretty">
              Manage specializations, practice areas, and case types for your
              legal practice
            </p>
          </div>

          <Tabs defaultValue="specializations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specializations">Specializations</TabsTrigger>
              <TabsTrigger value="practice-areas">Practice Areas</TabsTrigger>
              <TabsTrigger value="case-types">Case Types</TabsTrigger>
            </TabsList>

            <TabsContent value="specializations">
              <SpecializationsCard />
            </TabsContent>

            <TabsContent value="practice-areas">
              <PracticeAreasCard />
            </TabsContent>

            <TabsContent value="case-types">
              <CaseTypeCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
