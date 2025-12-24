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
import { toast } from "sonner";
import {
  useAddCaseTypeMutation,
  useDeleteCasetypeMutation,
  useUpdateCasetypeMutation,
} from "@/store/tanstack/mutations/CasetypeMutation";

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
  const { mutateAsync: addCasetype, isPending: isAddingCasetype } =
    useAddCaseTypeMutation();
  const { mutateAsync: updateCasetype, isPending: isEditingCasetype } =
    useUpdateCasetypeMutation({
      limit: itemsPerPage,
      page: currentPage,
      search: caseTypeSearch,
      pid: practiceId,
    });
  const { mutateAsync: deleteCasetype, isPending: isDeleting } =
    useDeleteCasetypeMutation();
  const handleSubmit = async (
    name: string,
    practiceId: string,
    editingId?: string
  ) => {
    if (!name) {
      toast.error("name is required");
      return;
    }
    if (!practiceId) {
      return toast.error("specialization id");
    }
    try {
      if (!editingId) {
        await addCasetype({ name, pid: practiceId });
      } else {
        await updateCasetype({
          id: editingId,
          name: name,
          pid: practiceId,
        });
      }
    } catch (error) {
      console.log("error in adidng or updating", error);
    } finally {
      setIsCaseTypeModalOpen(false);
    }
  };
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
            isAdding={isAddingCasetype}
            isEditing={isEditingCasetype}
            isOpen={isCaseTypeModalOpen}
            onOpenChange={setIsCaseTypeModalOpen}
            editingCaseType={editingCaseType}
            practiceAreas={practiceAreas}
            specializations={specialisations}
            onSubmit={handleSubmit}
            onReset={() => {
              setEditingCaseType(null);
              setCaseTypeSearch("");
            }}
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
          onDelete={async (id) => {
            await deleteCasetype(id);
          }}
          isDeleting={isDeleting}
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
