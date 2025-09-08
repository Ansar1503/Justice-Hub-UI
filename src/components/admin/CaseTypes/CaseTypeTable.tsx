"use client";

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
import { formatDate } from "@/utils/utils";
import { CaseTypestype } from "@/types/types/CaseType";
import { PracticeAreaType } from "@/types/types/PracticeAreaType";
import { SpecializationsType } from "@/types/types/SpecializationType";

interface CaseTypesTableProps {
  caseTypes: CaseTypestype[];
  practiceAreas: PracticeAreaType[];
  specializations: SpecializationsType[];
  onEdit: (caseType: CaseTypestype) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function CaseTypesTable({
  caseTypes,
  practiceAreas,
  specializations,
  onEdit,
  onDelete,
  isDeleting,
}: CaseTypesTableProps) {
  const getPracticeAreaName = (id: string) => {
    return practiceAreas.find((p) => p.id === id)?.name || "Unknown";
  };

  const getSpecializationName = (id: string) => {
    return specializations.find((s) => s.id === id)?.name || "Unknown";
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Practice Area</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {caseTypes && caseTypes.length > 0 ? (
              caseTypes.map((caseType) => {
                const practiceArea = practiceAreas.find(
                  (p) => p.id === caseType.practiceareaId
                );
                return (
                  <motion.tr
                    key={caseType.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group"
                  >
                    <TableCell className="font-medium">
                      {caseType.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPracticeAreaName(caseType.practiceareaId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {practiceArea
                          ? getSpecializationName(practiceArea.specializationId)
                          : "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(new Date(caseType.createdAt))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(caseType)}
                          disabled={isDeleting}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() => onDelete(caseType.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  No Case Types found
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
