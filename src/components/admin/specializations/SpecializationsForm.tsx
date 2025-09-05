import { useEffect, useState } from "react";
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
import { Plus } from "lucide-react";
import type { SpecializationsType } from "@/types/types/SpecializationType";

interface SpecializationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingSpecialization: SpecializationsType | null;
  onSubmit: (name: string) => void;
  onReset: () => void;
  savingSpec: boolean;
}

export function SpecializationForm({
  isOpen,
  onOpenChange,
  editingSpecialization,
  onSubmit,
  onReset,
  savingSpec,
}: SpecializationFormProps) {
  const [name, setName] = useState(editingSpecialization?.name || "");
  const [specError, setSpecError] = useState("");
  useEffect(() => {
    if (editingSpecialization?.name) {
      setName(editingSpecialization?.name);
    }
  }, [editingSpecialization]);
  const handleInput = (val: string) => {
    setName(val);
    if (!val.trim()) {
      setSpecError("Specialization name is required");
    } else if (val.trim().length < 3) {
      setSpecError("Specialization should be at least 3 characters long");
    } else if (val.trim().length > 50) {
      setSpecError("Specialization cannot exceed 50 characters");
    } else if (!/^[A-Za-z\s/&-]+$/.test(val)) {
      setSpecError(
        "Only letters, spaces, '-', '/' and '&' are allowed in specialization name"
      );
    } else {
      setSpecError("");
    }
  };
  const handleSubmit = () => {
    if (!name.trim() || specError.trim()) return;
    onSubmit(name);
    setName("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("");
      onReset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onReset} disabled={savingSpec}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingSpecialization
              ? "Edit Specialization"
              : "Add New Specialization"}
          </DialogTitle>
          <DialogDescription>
            {editingSpecialization
              ? "Update the specialization details."
              : "Create a new legal specialization."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="spec-name">Name</Label>
            <Input
              id="spec-name"
              value={name}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Enter specialization name"
            />
            {specError && (
              <span className="text-red-600 text-sm mt-1 block">
                {specError}
              </span>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingSpecialization ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
