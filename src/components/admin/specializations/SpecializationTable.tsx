import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";
import type { SpecializationsType } from "@/types/types/SpecializationType";
import { formatDate } from "@/utils/utils";
import Confirmation from "@/components/Confirmation";
import { useState } from "react";

interface SpecializationsTableProps {
  specializations: SpecializationsType[] | [];
  onEdit: (specialization: SpecializationsType) => void;
  onDelete: (spec: SpecializationsType | null) => void;
  isDeleting: boolean;
}

export function SpecializationsTable({
  specializations,
  onEdit,
  onDelete,
  isDeleting,
}: SpecializationsTableProps) {
  const [deleteSpec, setDeleteSpec] = useState<SpecializationsType | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specializations && specializations.length > 0 ? (
              specializations.map((specialization) => (
                <TableRow key={specialization.id} className="group">
                  <TableCell className="font-medium">
                    {specialization.id.slice(0, 6)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {specialization.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(new Date(specialization.createdAt))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => onEdit(specialization)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => {
                          setDeleteSpec(specialization);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-6"
                >
                  No specializations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Confirmation
        description="Are you sure you want to delete the specialization?"
        handleAction={() => onDelete(deleteSpec)}
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title={`Delete ${deleteSpec?.name} specialization`}
        className="bg-red-700 hover:bg-red-500"
      />
    </>
  );
}
