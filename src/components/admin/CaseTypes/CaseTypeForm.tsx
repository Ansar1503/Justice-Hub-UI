import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { PracticeAreaType } from "@/types/types/PracticeAreaType";
import { SpecializationsType } from "@/types/types/SpecializationType";
import { CaseTypestype } from "@/types/types/CaseType";

interface CaseTypeFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCaseType: CaseTypestype | null;
  practiceAreas: PracticeAreaType[] | [];
  specializations: SpecializationsType[] | [];
  onSubmit: (name: string, practiceAreaId: string) => void;
  onReset: () => void;
}

export function CaseTypeForm({
  isOpen,
  onOpenChange,
  editingCaseType,
  practiceAreas,
  specializations,
  onSubmit,
  onReset,
}: CaseTypeFormProps) {
  const [name, setName] = useState(editingCaseType?.name || "");
  const [practiceAreaId, setPracticeAreaId] = useState(
    editingCaseType?.practiceareaId || ""
  );

  const getSpecializationName = (id: string) => {
    return specializations.find((s) => s.id === id)?.name || "Unknown";
  };

  const handleSubmit = () => {
    if (!name.trim() || !practiceAreaId) return;
    onSubmit(name, practiceAreaId);
    setName("");
    setPracticeAreaId("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("");
      setPracticeAreaId("");
      onReset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onReset}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCaseType ? "Edit Case Type" : "Add New Case Type"}
          </DialogTitle>
          <DialogDescription>
            {editingCaseType
              ? "Update the case type details."
              : "Create a new case type."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ct-name">Name</Label>
            <Input
              id="ct-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter case type name"
            />
          </div>
          <div>
            <Label htmlFor="ct-practice-area">Practice Area</Label>
            <Select value={practiceAreaId} onValueChange={setPracticeAreaId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a practice area" />
              </SelectTrigger>
              <SelectContent>
                {practiceAreas.map((pa) => (
                  <SelectItem key={pa.id} value={pa.id}>
                    {pa.name} ({getSpecializationName(pa.specializationId)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingCaseType ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
