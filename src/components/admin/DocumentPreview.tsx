import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export function DocumentPreview(payload: {
  previewDocument: any;
  setPreviewDocument: any;
  handleDownloadDocument: any;
}) {
  return (
    <Dialog
      open={!!payload.previewDocument}
      onOpenChange={() => payload.setPreviewDocument(null)}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Document Preview - {payload.previewDocument?.name}</span>
          </DialogTitle>
          <DialogDescription>{payload.previewDocument?.name}</DialogDescription>
        </DialogHeader>
        <div className="py-4 flex justify-center">
          <img
            src={payload.previewDocument?.url || "/placeholder.svg"}
            alt="Document Preview"
            className="max-h-[60vh] object-contain border rounded-md"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              payload.handleDownloadDocument(
                payload.previewDocument?.url || "",
                payload.previewDocument?.name || "document"
              )
            }
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
