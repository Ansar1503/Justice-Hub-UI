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
import { SpecializationsType } from "@/types/types/SpecializationType";
import { PracticeAreaType } from "@/types/types/PracticeAreaType";

interface PracticeAreaFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPracticeArea: PracticeAreaType | null;
  specializations: SpecializationsType[];
  onSubmit: (
    name: string,
    specializationId: string,
    editingId?: string
  ) => void;
  onReset: () => void;
}

export function PracticeAreaForm({
  isOpen,
  onOpenChange,
  editingPracticeArea,
  specializations,
  onSubmit,
  onReset,
}: PracticeAreaFormProps) {
  const [name, setName] = useState(editingPracticeArea?.name || "");
  const [specializationId, setSpecializationId] = useState(
    editingPracticeArea?.specializationId || ""
  );

  const handleSubmit = () => {
    if (!name.trim() || !specializationId) return;
    onSubmit(name, specializationId, editingPracticeArea?.id);
    setName("");
    setSpecializationId("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("");
      setSpecializationId("");
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
            {editingPracticeArea
              ? "Edit Practice Area"
              : "Add New Practice Area"}
          </DialogTitle>
          <DialogDescription>
            {editingPracticeArea
              ? "Update the practice area details."
              : "Create a new practice area."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="pa-name">Name</Label>
            <Input
              id="pa-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter practice area name"
            />
          </div>
          <div>
            <Label htmlFor="pa-specialization">Specialization</Label>
            <Select
              value={specializationId}
              onValueChange={setSpecializationId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec.id} value={spec.id}>
                    {spec.name}
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
            {editingPracticeArea ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
