import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpecializationForm } from "./SpecializationsForm";
import SearchComponent from "@/components/SearchComponent";
import { SpecializationsTable } from "./SpecializationTable";
import { useEffect, useMemo, useState } from "react";
import { SpecializationsType } from "@/types/types/SpecializationType";
// import { PracticeAreaType } from "@/types/types/PracticeAreaType";
import { useFetchAllSpecializations } from "@/store/tanstack/Queries/SpecializationQueries";
import { SelectComponent } from "@/components/SelectComponent";
import PaginationComponent from "@/components/pagination";
import toast from "react-hot-toast";
import {
  useDeleteSpecialization,
  useSpecializationMutation,
} from "@/store/tanstack/mutations/SpecializationMutation";

export default function SpecializationsCard() {
  const [specializationSearch, setSpecializationSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSpecializationModalOpen, setIsSpecializationModalOpen] =
    useState(false);
  const [editingId, setEditingId] = useState("");
  const [editingSpecialization, setEditingSpecialization] =
    useState<SpecializationsType | null>(null);
  const payload = useMemo(
    () => ({
      limit: itemsPerPage,
      page: currentPage,
      search: specializationSearch,
    }),
    [itemsPerPage, currentPage, specializationSearch]
  );
  useEffect(() => {
    if (editingSpecialization?.id) {
      setEditingId(editingSpecialization.id);
    }
  }, [editingSpecialization]);
  const { data: SpecializationData } = useFetchAllSpecializations(payload);
  const specialisations = useMemo(
    () => SpecializationData?.data || [],
    [SpecializationData?.data]
  );
  const { mutate: DeleteSpec, isPending: deletingSpec } =
    useDeleteSpecialization(setCurrentPage, payload);
  const { mutate: saveSpecialization, isPending: savingSpec } =
    useSpecializationMutation(setCurrentPage, payload, editingId ?? "");
  const handleDelete = async (spec: SpecializationsType | null) => {
    const id = spec?.id;
    if (!id) {
      toast.error("spec id is required");
      return;
    }
    try {
      await DeleteSpec(id);
    } catch (error) {
      console.log("error deleting", error);
    }
  };
  const handleSave = async (name: string) => {
    try {
      await saveSpecialization({ name: name.trim() });
      setIsSpecializationModalOpen(false);
      setEditingSpecialization(null);
    } catch (error) {
      console.error("Error while saving specialization", error);
    }
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Specializations</CardTitle>
            <CardDescription>
              Manage legal specializations used by lawyers
            </CardDescription>
          </div>
          <SpecializationForm
            isOpen={isSpecializationModalOpen}
            onOpenChange={setIsSpecializationModalOpen}
            editingSpecialization={editingSpecialization}
            onSubmit={handleSave}
            onReset={() => {
              setIsSpecializationModalOpen(false);
              setEditingSpecialization(null);
            }}
            savingSpec={savingSpec}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {" "}
          <SearchComponent
            className="w-full"
            placeholder="Search specializations..."
            searchTerm={specializationSearch}
            setSearchTerm={(val) => {
              setSpecializationSearch(val);
              if (val.trim()) {
                setCurrentPage(1);
              }
            }}
          />
          <SelectComponent
            onSelect={(val) => {
              const num = Number.parseInt(val);
              if (!isNaN(num)) setItemsPerPage(num);
            }}
            selectedValue={itemsPerPage.toString()}
            label="Items per page"
            placeholder="Items"
            values={["5", "10", "20", "50"]}
          />
        </div>
        <SpecializationsTable
          specializations={specialisations}
          onEdit={(spec) => {
            setEditingSpecialization(spec);
            setIsSpecializationModalOpen(true);
          }}
          onDelete={handleDelete}
          isDeleting={deletingSpec}
        />
        <PaginationComponent
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
          totalItems={SpecializationData?.totalCount || 0}
          itemsPerPage={itemsPerPage}
          totalPages={SpecializationData?.totalPage || 0}
        />
      </CardContent>
    </Card>
  );
}
