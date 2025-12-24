"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  X,
  Plus,
  Send,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ChatDocumentsPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFiles: {
    file: File;
    progress: number;
    uploaded: boolean;
    id: string;
  }[];
  onFilesChange: (
    files: {
      file: File;
      progress: number;
      uploaded: boolean;
      id: string;
    }[]
  ) => void;
  onSend: (
    files: {
      file: File;
      progress: number;
      uploaded: boolean;
      id: string;
    }[]
  ) => void;
}

export default function ChatDocumentsPreview({
  isOpen,
  onClose,
  selectedFiles,
  onFilesChange,
  onSend,
}: ChatDocumentsPreviewProps) {
  //   console.log("chhatDocumentsPreviewRendered", selectedFiles);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) return <ImageIcon className="h-8 w-8" />;
    if (type.startsWith("video/")) return <Video className="h-8 w-8" />;
    if (type.startsWith("audio/")) return <Music className="h-8 w-8" />;
    if (type.includes("zip") || type.includes("rar"))
      return <Archive className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  //   const canPreview = (file: File) => {
  //     return file.type.startsWith("image/") || file.type.startsWith("video/");
  //   };

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file) || "/placeholder.svg"}
          alt={file.name}
          className="max-w-full max-h-96 object-contain rounded-lg"
        />
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <video
          src={URL.createObjectURL(file)}
          controls
          className="max-w-full max-h-96 rounded-lg"
        />
      );
    }

    // No preview available
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-4">
          {getFileIcon(file)}
        </div>
        <p className="text-gray-400 text-lg mb-2">No preview available</p>
        <p className="text-gray-500 text-sm">
          {getFileSize(file.size)} - {getFileExtension(file.name)}
        </p>
      </div>
    );
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      progress: 0,
      uploaded: false,
      id: file.name,
    }));
    if (selectedFiles.length + newFiles.length > 5) {
      toast.error("You can only upload 5 files at a time");
      return;
    }
    onFilesChange([...selectedFiles, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
    if (currentFileIndex >= updatedFiles.length && updatedFiles.length > 0) {
      setCurrentFileIndex(updatedFiles.length - 1);
    }
  };

  const handleSend = () => {
    if (selectedFiles.length > 0) {
      onSend(selectedFiles);
      onClose();
    }
  };

  const handleClose = () => {
    onFilesChange([]);
    onClose();
  };

  if (!isOpen || selectedFiles.length === 0) return null;

  const currentFile = selectedFiles[currentFileIndex];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] bg-gray-900 text-white border-gray-700 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium">{currentFile?.file.name}</h2>
        </div>

        {/* File Preview Area */}
        <div className="flex-1 flex items-center justify-center p-8 min-h-0">
          {renderFilePreview(currentFile.file)}
        </div>

        {/* File Selection and Actions */}
        <div className="grid grid-cols-[1fr_3rem] items-center p-4 border-t border-gray-700 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {/* File thumbnails */}
            <div className="flex gap-2 max-w-md overflow-x-auto scrollbar-hide">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <Button
                    variant={index === currentFileIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentFileIndex(index)}
                    className={`h-12 w-12 p-1 relative ${
                      index === currentFileIndex
                        ? "bg-blue-600 border-blue-500"
                        : "bg-gray-800 border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {file.file.type.startsWith("image/") ? (
                      <img
                        src={
                          URL.createObjectURL(file.file) || "/placeholder.svg"
                        }
                        alt={file.file.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="flex items-center justify-center text-xs">
                        {getFileExtension(file.file.name)}
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-600 hover:bg-red-700 rounded-full "
                  >
                    <X className="h-3 w-3 " />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add more files button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleAddFiles}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-12 bg-gray-800 border-gray-600 hover:bg-gray-700"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={selectedFiles.length === 0}
            className="bg-green-600 hover:bg-green-700 rounded-full h-12 w-12 p-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {selectedFiles.length > 1 && (
          <div className="absolute top-24 left-4 ">
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              {currentFileIndex + 1} of {selectedFiles.length}
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
