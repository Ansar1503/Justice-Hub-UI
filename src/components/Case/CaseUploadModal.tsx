import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export interface DocumentItem {
  _id?: string;
  name: string;
  type: string;
  url: string;
}

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (doc: DocumentItem) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("File size must be less than 20MB");
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Only PDF, JPG, or PNG files are allowed");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;

    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Upload your case document here</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="file">Select a file</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
              MB)
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
