import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar } from "lucide-react";
import type { SpecializationsType } from "@/types/types/SpecializationType";
import { formatDate } from "@/utils/utils";
import { PracticeAreaType } from "@/types/types/PracticeAreaType";

interface PracticeAreasTableProps {
  practiceAreas: PracticeAreaType[];
  specializations: SpecializationsType[];
  onEdit: (practiceArea: PracticeAreaType) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function PracticeAreasTable({
  practiceAreas,
  specializations,
  onEdit,
  onDelete,
  isDeleting,
}: PracticeAreasTableProps) {
  const getSpecializationName = (id: string) => {
    return specializations.find((s) => s.id === id)?.name || "Unknown";
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {practiceAreas && practiceAreas.length > 0 ? (
              practiceAreas.map((practiceArea) => (
                <motion.tr
                  key={practiceArea.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group"
                >
                  <TableCell className="font-medium">
                    {practiceArea.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getSpecializationName(practiceArea.specializationId)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(new Date(practiceArea.createdAt))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(practiceArea)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() => onDelete(practiceArea.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-6"
                >
                  No Practice Areas found
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
