"use client";

import { useState } from "react";
import { X, FileText, ImageIcon, Video, Music, Archive } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DisputeAttachment {
  name: string;
  url: string;
  type: string;
}

interface ChatDocumentsPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  files: DisputeAttachment[];
}

export default function ChatDocumentsPreview({
  isOpen,
  onClose,
  files,
}: ChatDocumentsPreviewProps) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-8 w-8" />;
    if (type.startsWith("video/")) return <Video className="h-8 w-8" />;
    if (type.startsWith("audio/")) return <Music className="h-8 w-8" />;
    if (type.includes("zip") || type.includes("rar"))
      return <Archive className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  const renderFilePreview = (file: DisputeAttachment) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={file.url || "/placeholder.svg"}
          alt={file.name}
          className="max-w-full max-h-[70vh] object-contain rounded-lg"
        />
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <video
          src={file.url}
          controls
          className="max-w-full max-h-[70vh] rounded-lg"
        />
      );
    }

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      return (
        <iframe
          src={file.url}
          className="w-full h-[70vh] rounded-lg border"
          title="PDF Preview"
        />
      );
    }

    if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
      return (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline text-lg"
        >
          Open {file.name}
        </a>
      );
    }

    // Fallback: generic document
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-4">
          {getFileIcon(file.type)}
        </div>
        <p className="text-gray-400 text-lg mb-2">No inline preview</p>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline text-sm"
        >
          Open document ({getFileExtension(file.name)})
        </a>
      </div>
    );
  };

  if (!isOpen || files.length === 0) return null;

  const currentFile = files[currentFileIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] bg-gray-900 text-white border-gray-700 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium truncate">{currentFile?.name}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* File Preview Area */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          {renderFilePreview(currentFile)}
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2 p-4 border-t border-gray-700 overflow-x-auto scrollbar-hide">
          {files.map((file, index) => (
            <Button
              key={index}
              variant={index === currentFileIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFileIndex(index)}
              className={`h-14 w-14 p-1 flex-shrink-0 ${
                index === currentFileIndex
                  ? "bg-blue-600 border-blue-500"
                  : "bg-gray-800 border-gray-600 hover:bg-gray-700"
              }`}
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={file.url || "/placeholder.svg"}
                  alt={file.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="flex items-center justify-center text-[10px] font-medium">
                  {getFileExtension(file.name)}
                </div>
              )}
            </Button>
          ))}
        </div>

        {/* Index Badge */}
        {files.length > 1 && (
          <div className="absolute top-24 left-4">
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              {currentFileIndex + 1} of {files.length}
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
