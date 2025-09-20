import { CaseQueryResponseType } from "@/types/types/Case";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
              Cases.map((c: any) => (
                <TableRow key={c}>
                  <TableCell className="p-3 bg-white/5"></TableCell>
                  <TableCell className="p-3 bg-white/5"></TableCell>
                  <TableCell className="p-3 bg-white/5"></TableCell>
                  <TableCell className="p-3 bg-white/5"></TableCell>
                  <TableCell className="p-3 bg-white/5"></TableCell>
                  <TableCell className="p-3 bg-white/5"></TableCell>
                  <TableCell className="p-3 bg-white/5"></TableCell>
                  <TableCell className="p-3 bg-white/5"></TableCell>
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
