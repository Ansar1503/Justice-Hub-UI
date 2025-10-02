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
import { Upload, FileText, CheckCircle2, XCircle, X } from "lucide-react";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File[]) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const currentCount = files.length;

    if (currentCount + fileArray.length > MAX_FILES) {
      setError(`You can only upload up to ${MAX_FILES} files at once`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} exceeds 20MB limit`);
        return;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`${file.name} is not a supported format (PDF, JPG, PNG only)`);
        return;
      }

      validFiles.push(file);
    }

    setError(null);
    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      validateAndAddFiles(droppedFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      validateAndAddFiles(selectedFiles);
    }

    e.target.value = "";
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    onUpload(files);
    setFiles([]);
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setFiles([]);
    setError(null);
    setIsDragging(false);
    onClose();
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const canAddMore = files.length < MAX_FILES;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload Documents</DialogTitle>
          <DialogDescription>
            Upload up to {MAX_FILES} documents in PDF, JPG, or PNG format (max
            20MB each)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 flex-1 overflow-y-auto">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 text-center 
              transition-all duration-200 cursor-pointer
              ${
                !canAddMore
                  ? "border-muted bg-muted/10 cursor-not-allowed opacity-60"
                  : isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }
            `}
            onClick={() =>
              canAddMore && document.getElementById("file-input")?.click()
            }
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileInputChange}
              className="hidden"
              multiple
              disabled={!canAddMore}
            />

            <div className="flex flex-col items-center gap-4">
              <div
                className={`
                w-16 h-16 rounded-full flex items-center justify-center
                transition-all duration-200
                ${isDragging ? "bg-primary/20 scale-110" : "bg-muted"}
              `}
              >
                <Upload
                  className={`h-8 w-8 ${
                    isDragging ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>

              <div>
                <p className="text-lg font-semibold mb-1">
                  {!canAddMore
                    ? `Maximum ${MAX_FILES} files reached`
                    : isDragging
                    ? "Drop your files here"
                    : "Drag & drop your files here"}
                </p>
                {canAddMore && (
                  <p className="text-sm text-muted-foreground">
                    or click to browse ({files.length}/{MAX_FILES} files
                    selected)
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                <span>PDF, JPG, PNG</span>
                <span className="opacity-60">•</span>
                <span>Max 20MB each</span>
                <span className="opacity-60">•</span>
                <span>Up to {MAX_FILES} files</span>
              </div>
            </div>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  Selected Files ({files.length}/{MAX_FILES})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Total: {(totalSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl group hover:shadow-sm transition-shadow"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <p className="font-medium text-sm truncate text-green-900 dark:text-green-100">
                          {file.name}
                        </p>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                {error}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="shadow-sm">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="shadow-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
