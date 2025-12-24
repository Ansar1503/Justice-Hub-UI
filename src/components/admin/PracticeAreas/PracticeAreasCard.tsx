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
import { SelectComponent } from "@/components/SelectComponent";
import { toast } from "sonner";
import {
  useAddPracticeAreasMutation,
  useDeletePracticeAreaMutation,
  useEditPracticeAreaMutation,
} from "@/store/tanstack/mutations/PracticeAreasMutation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchAllPracticeAreaQuery } from "@/store/tanstack/Queries/PracticeAreaQuery";
import PaginationComponent from "@/components/pagination";

export default function PracticeAreasCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [specId, setSpecId] = useState<string>("");
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
  const { mutateAsync: AddPracticeArea, isPending: isPracticeAreaAdding } =
    useAddPracticeAreasMutation();
  const { mutateAsync: updatePracticeArea, isPending: isEditing } =
    useEditPracticeAreaMutation({
      limit: itemsPerPage,
      page: currentPage,
      search: practiceAreaSearch,
      specId,
    });
  const { mutateAsync: deletePA, isPending: isDeleting } =
    useDeletePracticeAreaMutation();
  const { data: PracticeAreaData } = useFetchAllPracticeAreaQuery({
    limit: itemsPerPage,
    page: currentPage,
    search: practiceAreaSearch,
    specId,
  });
  const practiceAreas = useMemo(
    () => PracticeAreaData?.data || [],
    [PracticeAreaData?.data]
  );
  const handleSubmit = async (
    name: string,
    specializationId: string,
    editingId?: string
  ) => {
    if (!name) {
      toast.error("name is required");
      return;
    }
    if (!specializationId) {
      return toast.error("specialization id");
    }
    try {
      if (!editingId) {
        await AddPracticeArea({ name, specId: specializationId });
      } else {
        await updatePracticeArea({
          id: editingId,
          name: name,
          specId: specializationId,
        });
      }
    } catch (error) {
      console.log("error in adidng or updating", error);
    } finally {
      setIsPracticeAreaModalOpen(false);
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
            isPracticeAreaAdding={isPracticeAreaAdding}
            editingPracticeArea={editingPracticeArea}
            specializations={specialisations}
            onSubmit={handleSubmit}
            onReset={() => {
              setEditingPracticeArea(null);
              setPracticeAreaSearch("");
            }}
            isPracticeAreaEditing={isEditing}
            specId={editingPracticeArea?.specializationId || ""}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <SearchComponent
            className="w-full"
            placeholder="Search practice areas..."
            searchTerm={practiceAreaSearch}
            setSearchTerm={setPracticeAreaSearch}
          />
          <Select
            onValueChange={(val) => setSpecId(val === "clear" ? "" : val)}
            value={specId || "clear"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Specialization</SelectLabel>

                <SelectItem value="clear">All Specializations</SelectItem>

                {specialisations.map((value) => (
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
        <PracticeAreasTable
          practiceAreas={practiceAreas}
          specializations={specialisations}
          onEdit={(pa) => {
            setEditingPracticeArea(pa);
            setIsPracticeAreaModalOpen(true);
          }}
          onDelete={async (id) => {
            await deletePA(id);
          }}
          isDeleting={isDeleting}
        />
        <PaginationComponent
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
          totalItems={PracticeAreaData?.totalCount || 0}
          itemsPerPage={itemsPerPage}
          totalPages={PracticeAreaData?.totalPage || 0}
        />
      </CardContent>
    </Card>
  );
}
