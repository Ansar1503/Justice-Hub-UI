import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PracticeAreaForm } from "./PracticeAreasForm";
import SearchComponent from "@/components/SearchComponent";
import { PracticeAreasTable } from "./PracticeAreasTable";
import { useMemo, useState } from "react";
import { PracticeAreaType } from "@/types/types/PracticeAreaType";
import { useFetchAllSpecializations } from "@/store/tanstack/Queries/SpecializationQueries";

export default function PracticeAreasCard() {
  const [isPracticeAreaModalOpen, setIsPracticeAreaModalOpen] = useState(false);
  const [practiceAreaSearch, setPracticeAreaSearch] = useState("");
  const [editingPracticeArea, setEditingPracticeArea] =
    useState<PracticeAreaType | null>(null);
  const { data: SpecializationData } = useFetchAllSpecializations({
    limit: 100,
    page: 1,
    search: "",
  });
  const specialisations = useMemo(
    () => SpecializationData?.data || [],
    [SpecializationData?.data]
  );

  const handleSubmit = async (
    name: string,
    specializationId: string,
    editingId?: string
  ) => {
    if (!editingId) {
      console.log("first");
    } else {
      console.log("second");
    }
  };
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Practice Areas</CardTitle>
            <CardDescription>
              Manage practice areas within specializations
            </CardDescription>
          </div>
          <PracticeAreaForm
            isOpen={isPracticeAreaModalOpen}
            onOpenChange={setIsPracticeAreaModalOpen}
            editingPracticeArea={editingPracticeArea}
            specializations={specialisations}
            onSubmit={handleSubmit}
            onReset={() => {}}
          />
        </div>
      </CardHeader>
      <CardContent>
        <SearchComponent
          placeholder="Search practice areas..."
          searchTerm={practiceAreaSearch}
          setSearchTerm={setPracticeAreaSearch}
        />
        <PracticeAreasTable
          practiceAreas={[]}
          specializations={specialisations}
          onEdit={(spec) => {
            setEditingPracticeArea(spec);
          }}
          onDelete={() => {}}
        />
      </CardContent>
    </Card>
  );
}
