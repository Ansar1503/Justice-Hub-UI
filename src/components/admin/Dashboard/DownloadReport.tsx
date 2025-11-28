import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function AdminDownloadReportButton({
    startDate,
    endDate,
}: {
    startDate: string;
    endDate: string;
}) {
    console.log(startDate, endDate);
    // const handleDownload = (type: "pdf" | "xls") => {
    //     const url = `/api/admin/sales-report?type=${type}&start=${startDate}&end=${endDate}`;
    //     window.open(url, "_blank"); // triggers backend to return file
    // };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log("PDF")}>
                    PDF
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => console.log("Excel")}>
                    Excel (.xls)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
