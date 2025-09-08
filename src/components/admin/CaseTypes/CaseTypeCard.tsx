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
import { useMemo, useState } from "react";
import { CaseTypestype } from "@/types/types/CaseType";
import { useFetchAllSpecializations } from "@/store/tanstack/Queries/SpecializationQueries";
import { useFetchAllPracticeAreaQuery } from "@/store/tanstack/Queries/PracticeAreaQuery";
import { useFetchAllCaseTypes } from "@/store/tanstack/Queries/CasetypeQuery";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectComponent } from "@/components/SelectComponent";
import PaginationComponent from "@/components/pagination";

export default function CaseTypeCard() {
  const [isCaseTypeModalOpen, setIsCaseTypeModalOpen] = useState(false);
  const [editingCaseType, setEditingCaseType] = useState<CaseTypestype | null>(
    null
  );
  const [practiceId, setPracticeId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [caseTypeSearch, setCaseTypeSearch] = useState("");
  const { data: SpecializationData } = useFetchAllSpecializations({
    limit: 1000,
    page: 1,
    search: "",
  });
  const specialisations = useMemo(
    () => SpecializationData?.data || [],
    [SpecializationData?.data]
  );
  const { data: PracticeAreaData } = useFetchAllPracticeAreaQuery({
    limit: 1000,
    page: 1,
    search: "",
    specId: "",
  });
  const practiceAreas = useMemo(
    () => PracticeAreaData?.data || [],
    [PracticeAreaData?.data]
  );
  const { data: CasetypeData } = useFetchAllCaseTypes({
    limit: itemsPerPage,
    page: currentPage,
    search: caseTypeSearch,
    pid: practiceId,
  });
  const Casetypes = useMemo(
    () => CasetypeData?.data || [],
    [CasetypeData?.data]
  );

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
            specializations={specialisations}
            onSubmit={() => {}}
            onReset={() => {}}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <SearchComponent
            placeholder="Search case types..."
            searchTerm={caseTypeSearch}
            setSearchTerm={setCaseTypeSearch}
            className="w-full"
          />
          <Select
            onValueChange={(val) => setPracticeId(val === "clear" ? "" : val)}
            value={practiceId || "clear"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a PracticeArea" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>PracticeAreas</SelectLabel>

                <SelectItem value="clear">All PracticeAreas</SelectItem>

                {practiceAreas?.map((value) => (
                  <SelectItem key={value.id} value={value.id}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <SelectComponent
            onSelect={(val) => {
              if (val === "Empty") {
                return;
              }
              const num = Number.parseInt(val);
              if (!isNaN(num)) setItemsPerPage(num);
            }}
            selectedValue={itemsPerPage.toString()}
            label="Items per page"
            placeholder="Items"
            values={["5", "10", "20", "50"]}
          />
        </div>
        <CaseTypesTable
          caseTypes={Casetypes}
          practiceAreas={practiceAreas}
          specializations={specialisations}
          onEdit={(data) => {
            setEditingCaseType(data);
            setIsCaseTypeModalOpen(true);
          }}
          onDelete={() => {}}
        />
        <PaginationComponent
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
          totalItems={CasetypeData?.totalCount || 0}
          itemsPerPage={itemsPerPage}
          totalPages={CasetypeData?.totalPage || 0}
        />
      </CardContent>
    </Card>
  );
}
