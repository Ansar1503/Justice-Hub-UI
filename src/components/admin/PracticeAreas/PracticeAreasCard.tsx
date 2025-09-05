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
import { useState } from "react";
import { PracticeAreaType } from "@/types/types/PracticeAreaType";
import { SpecializationsType } from "@/types/types/SpecializationType";

export default function PracticeAreasCard() {
  const [isPracticeAreaModalOpen, setIsPracticeAreaModalOpen] = useState(false);
  const [practiceAreaSearch, setPracticeAreaSearch] = useState("");
  const [editingPracticeArea, setEditingPracticeArea] =
    useState<PracticeAreaType | null>(null);
  const specialisations: SpecializationsType[] | [] = [];
const practiceAreas
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
            onSubmit={() => {}}
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
          practiceAreas={}
          specializations={specializations}
          onEdit={handlePracticeAreaEdit}
          onDelete={handlePracticeAreaDelete}
        />
      </CardContent>
    </Card>
  );
}
