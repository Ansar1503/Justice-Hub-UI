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
import { Button } from "../ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/store/redux/Hook";

type Props = {
  Cases: CaseQueryResponseType["data"] | null;
};

export default function CaseList({ Cases }: Props) {
  const { user } = useAppSelector((s) => s.Auth);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-muted/30">
              <TableHead className="font-semibold">Case ID</TableHead>
              <TableHead className="font-semibold">Case Title</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Primary Lawyer</TableHead>
              <TableHead className="font-semibold">Case Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Cases && Cases.length > 0 ? (
              Cases.map((c, i) => (
                <TableRow
                  key={c.id || i}
                  className="group hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-mono text-sm font-medium">
                    #
                    {c.id
                      ? c.id.slice(-6).toUpperCase()
                      : `CASE-${String(i + 1).padStart(3, "0")}`}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    <div className="truncate" title={c.title}>
                      {c.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {c.clientDetails.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">
                        {c.clientDetails.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {c.lawyerDetails.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">
                        {c.lawyerDetails.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
                      {c.caseTypeDetails.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CaseStatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(new Date(c.createdAt))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/${user?.role}/cases/${c.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View case details</span>
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={`/${user?.role}/cases/${c.id}`}>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>Edit case</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center ">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="rounded-full bg-muted flex items-center justify-center">
                      <Eye className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">No cases found</h3>
                    <p className="text-sm text-muted-foreground">
                      Get started by creating your first case.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
