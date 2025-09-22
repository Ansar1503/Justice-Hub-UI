import { CaseQueryResponseType } from "@/types/types/Case";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { formatDate } from "@/utils/utils";

type Props = {
  Cases: CaseQueryResponseType["data"] | null;
};

export default function CaseList({ Cases }: Props) {
  return (
    <div className="space-y-4 px-5 pb-5">
      {/* Table Container */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-600/5 dark:bg-white/10">
            <TableRow>
              <TableHead>Case Id</TableHead>
              <TableHead>Case Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Lawyer</TableHead>
              <TableHead>Case Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Cases && Cases.length > 0 ? (
              Cases.map((c, i) => (
                <TableRow key={c.id || i}>
                  <TableCell className="py-3 px-4 text-foreground">
                    {c.id ? c.id.slice(5).toUpperCase() : "#Case-" + i}
                  </TableCell>
                  <TableCell className="p-3 bg-white/5 font-medium text-primary">
                    {c.title}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {c.clientDetails.name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {c.lawyerDetails.name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-muted-foreground">
                    {c.caseTypeDetails.name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    <CaseStatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground">
                    {formatDate(new Date(c.createdAt))}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-foreground"></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-4 text-lg">
                  No Cases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
