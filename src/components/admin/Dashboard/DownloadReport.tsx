import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { toast } from "sonner";

export function AdminDownloadReportButton({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const downloadReport = async (type: "pdf" | "xls") => {
    try {
      const res = await axiosinstance.get(
        `/api/admin/dashboard/sales-report?startDate=${startDate}&endDate=${endDate}&format=${type}`
      );
      const payload = res.data;
      if (!payload || !payload.file) {
        console.error("Invalid response format", res.data);
        return;
      }
      const { file: base64, mimeType, filename } = payload;
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download report");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => downloadReport("pdf")}>
          PDF
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => downloadReport("xls")}>
          Excel (.xls)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
