import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CaseTypeForm } from "./CaseTypeForm";
import SearchComponent from "@/components/SearchComponent";
import { CaseTypesTable } from "./CaseTypeTable";
import { useState } from "react";
import { CaseTypestype } from "@/types/types/CaseType";
import { PracticeAreaType } from "@/types/types/PracticeAreaType";
import { SpecializationsType } from "@/types/types/SpecializationType";

export default function CaseTypeCard() {
  const [isCaseTypeModalOpen, setIsCaseTypeModalOpen] = useState(false);
  const [editingCaseType, setEditingCaseType] = useState<CaseTypestype | null>(
    null
  );
  const [caseTypeSearch, setCaseTypeSearch] = useState("");
  const specializations: SpecializationsType[] | [] = [];
  const practiceAreas: PracticeAreaType[] | [] = [];
  const caseTypes: CaseTypestype[] | [] = [];
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Case Types</CardTitle>
            <CardDescription>
              Manage case types within practice areas
            </CardDescription>
          </div>
          <CaseTypeForm
            isOpen={isCaseTypeModalOpen}
            onOpenChange={setIsCaseTypeModalOpen}
            editingCaseType={editingCaseType}
            practiceAreas={practiceAreas}
            specializations={specializations}
            onSubmit={() => {}}
            onReset={() => {}}
          />
        </div>
      </CardHeader>
      <CardContent>
        <SearchComponent
          placeholder="Search case types..."
          searchTerm={caseTypeSearch}
          setSearchTerm={setCaseTypeSearch}
        />
        <CaseTypesTable
          caseTypes={caseTypes}
          practiceAreas={practiceAreas}
          specializations={specializations}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </CardContent>
    </Card>
  );
}
